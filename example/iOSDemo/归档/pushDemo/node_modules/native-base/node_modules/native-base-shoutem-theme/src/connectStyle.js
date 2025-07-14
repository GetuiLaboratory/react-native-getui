import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import * as _ from 'lodash';
import normalizeStyle from './StyleNormalizer/normalizeStyle';
import { StyleSheet } from "react-native";

import Theme, { ThemeShape } from "./Theme";
import { resolveComponentStyle } from "./resolveComponentStyle";

let themeCache = {};

/**
 * clear theme cache
 * @export
 */
export function clearThemeCache() {
  themeCache = {};
}

/**
 * Formats and throws an error when connecting component style with the theme.
 *
 * @param errorMessage The error message.
 * @param componentDisplayName The name of the component that is being connected.
 */
function throwConnectStyleError(errorMessage, componentDisplayName) {
  throw Error(
    `${errorMessage} - when connecting ${componentDisplayName} component to style.`
  );
}

/**
 * Returns the theme object from the provided context,
 * or an empty theme if the context doesn't contain a theme.
 *
 * @param context The React component context.
 * @returns {Theme} The Theme object.
 */
function getTheme(context) {
  // Fallback to a default theme if the component isn't
  // rendered in a StyleProvider.
  return context.theme || Theme.getDefaultTheme();
}

/**
 * Matches any style properties that represent component style variants.
 * Those styles can be applied to the component by using the styleName
 * prop. All style variant property names must start with a single '.'
 * character, e.g., '.variant'.
 *
 * @param propertyName The style property name.
 * @returns {boolean} True if the style property represents a component variant, false otherwise.
 */
function isStyleVariant(propertyName) {
  return /^\./.test(propertyName);
}

/**
 * Matches any style properties that represent style rules that target the
 * component children. Those styles can have two formats, they can either
 * target the components by component name ('shoutem.ui.Text'), or by component
 * name and variant ('shoutem.ui.Text.line-through'). Beside specifying the
 * component name, those styles can also target any component by using the
 * '*' wildcard ('*', or '*.line-through'). The rule to identify those styles is
 * that they have to contain a '.' character in their name or be a '*'.
 *
 * @param propertyName The style property name.
 * @returns {boolean} True if the style property represents a child style, false otherwise.
 */
function isChildStyle(propertyName) {
  return /(^[^\.].*\.)|^\*$/.test(propertyName);
}

function getConcreteStyle(style) {
  return _.pickBy(style, (value, key) => {
    return !isStyleVariant(key) && !isChildStyle(key);
  });
}

/**
 * Resolves the final component style by using the theme style, if available and
 * merging it with the style provided directly through the style prop, and style
 * variants applied through the styleName prop.
 *
 * @param componentStyleName The component name that will be used
 * to target this component in style rules.
 * @param componentStyle The default component style.
 * @param mapPropsToStyleNames Pure function to customize styleNames depending on props.
 * @param options The additional connectStyle options
 * @param options.virtual The default value of the virtual prop
 * @param options.withRef Create component ref with addedProps; if true, ref name is wrappedInstance
 * @returns {StyledComponent} The new component that will handle
 * the styling of the wrapped component.
 */
export default (
  componentStyleName,
  componentStyle = {},
  mapPropsToStyleNames,
  options = {}
) => {
  function getComponentDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }

  return function wrapWithStyledComponent(WrappedComponent) {
    const componentDisplayName = getComponentDisplayName(WrappedComponent);

    if (!_.isPlainObject(componentStyle)) {
      throwConnectStyleError(
        "Component style must be plain object",
        componentDisplayName
      );
    }

    if (!_.isString(componentStyleName)) {
      throwConnectStyleError(
        "Component Style Name must be string",
        componentDisplayName
      );
    }

    class StyledComponent extends React.Component {
      static contextTypes = {
        theme: ThemeShape,
        // The style inherited from the parent
        // parentStyle: PropTypes.object,
        parentPath: PropTypes.array
      };

      static childContextTypes = {
        // Provide the parent style to child components
        // parentStyle: PropTypes.object,
        // resolveStyle: PropTypes.func,
        parentPath: PropTypes.array
      };

      static propTypes = {
        // Element style that overrides any other style of the component
        style: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.number,
          PropTypes.array
        ]),
        // The style variant names to apply to this component,
        // multiple variants may be separated with a space character
        styleName: PropTypes.string,
        // Virtual elements will propagate the parent
        // style to their children, i.e., the children
        // will behave as they are placed directly below
        // the parent of a virtual element.
        virtual: PropTypes.bool
      };

      static defaultProps = {
        virtual: options.virtual
      };

      static displayName = `Styled(${componentDisplayName})`;
      static WrappedComponent = WrappedComponent;

      constructor(props, context) {
        super(props, context);
        // console.log(context.parentPath);
        const styleNames = this.getStyleNames(props);
        const style = props.style;

        const finalStyle = this.getFinalStyle(
          props,
          context,
          style,
          styleNames
        );

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
        this.resolveConnectedComponentStyle = this.resolveConnectedComponentStyle.bind(
          this
        );
        this.state = {
          style: finalStyle,
          // AddedProps are additional WrappedComponent props
          // Usually they are set trough alternative ways,
          // such as theme style, or trough options
          addedProps: this.resolveAddedProps(),
          styleNames
        };
      }

      getFinalStyle(props, context, style, styleNames) {
        let resolvedStyle = {};
        if (context.parentPath) {
          resolvedStyle = this.getOrSetStylesInCache(
            context,
            props,
            styleNames,
            [...context.parentPath, componentStyleName, ...styleNames]
          );
        } else {
          resolvedStyle = this.resolveStyle(context, props, styleNames);
          themeCache[componentStyleName] = resolvedStyle;
        }

        const concreteStyle = getConcreteStyle(_.merge({}, resolvedStyle));

        if (_.isArray(style)) {
          return [concreteStyle, ...style];
        }

        if (typeof style == "number" || typeof style == "object") {
          return [concreteStyle, style];
        }

        return concreteStyle;
      }

      getStyleNames(props) {
        const styleNamesArr = _.map(props, (value, key) => {
          if (typeof value !== "object" && value === true) {
            return "." + key;
          } else {
            return false;
          }
        });
        _.remove(styleNamesArr, (value, index) => {
          return value === false;
        });

        return styleNamesArr;
      }

      getParentPath() {
        if (!this.context.parentPath) {
          return [componentStyleName];
        } else {
          return [
            ...this.context.parentPath,
            componentStyleName,
            ...this.getStyleNames(this.props)
          ];
        }
      }

      getChildContext() {
        return {
          // parentStyle: this.props.virtual ?
          //   this.context.parentStyle :
          //   this.state.childrenStyle,
          // resolveStyle: this.resolveConnectedComponentStyle,
          parentPath: this.getParentPath()
        };
      }

      UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const styleNames = this.getStyleNames(nextProps);
        const style = nextProps.style;
        if (this.shouldRebuildStyle(nextProps, nextContext, styleNames)) {
          const finalStyle = this.getFinalStyle(
            nextProps,
            nextContext,
            style,
            styleNames
          );

          this.setState({
            style: finalStyle,
            // childrenStyle: resolvedStyle.childrenStyle,
            styleNames
          });
        }
      }

      setNativeProps(nativeProps) {
        if (this.wrappedInstance.setNativeProps) {
          this.wrappedInstance.setNativeProps(nativeProps);
        }
      }

      setWrappedInstance(component) {
        if (component && component._root) {
          this._root = component._root;
        } else {
          this._root = component;
        }
        this.wrappedInstance = this._root;
      }

      hasStyleNameChanged(nextProps, styleNames) {
        return (
          mapPropsToStyleNames &&
          this.props !== nextProps &&
          // Even though props did change here,
          // it doesn't necessary means changed props are those which affect styleName
          !_.isEqual(this.state.styleNames, styleNames)
        );
      }

      shouldRebuildStyle(nextProps, nextContext, styleNames) {
        return (
          nextProps.style !== this.props.style ||
          nextProps.styleName !== this.props.styleName ||
          nextContext.theme !== this.context.theme ||
          !_.isEqual(nextContext.parentPath, this.context.parentPath) ||
          this.hasStyleNameChanged(nextProps, styleNames)
        );
      }

      resolveStyleNames(props) {
        const { styleName } = props;
        const styleNames = styleName ? styleName.split(/\s/g) : [];

        if (!mapPropsToStyleNames) {
          return styleNames;
        }

        // We only want to keep the unique style names
        return _.uniq(mapPropsToStyleNames(styleNames, props));
      }

      resolveAddedProps() {
        const addedProps = {};
        if (options.withRef) {
          addedProps.ref = "wrappedInstance";
        }
        return addedProps;
      }

      getOrSetStylesInCache(context, props, styleNames, path) {
        if (themeCache && themeCache[path.join(">")]) {
          // console.log('**************');

          return themeCache[path.join(">")];
        } else {
          const resolvedStyle = this.resolveStyle(context, props, styleNames);
          if (Object.keys(themeCache).length < 10000) {
            themeCache[path.join(">")] = resolvedStyle;
          }
          return resolvedStyle;
        }
      }

      resolveStyle(context, props, styleNames) {
        let parentStyle = {};

        const theme = getTheme(context);
        const themeStyle = theme.createComponentStyle(
          componentStyleName,
          componentStyle
        );

        if (context.parentPath) {
          parentStyle = themeCache[context.parentPath.join(">")];
        } else {
          parentStyle = resolveComponentStyle(
            componentStyleName,
            styleNames,
            themeStyle,
            parentStyle
          );
        }

        return resolveComponentStyle(
          componentStyleName,
          styleNames,
          themeStyle,
          parentStyle
        );
      }

      /**
       * A helper function provided to child components that enables
       * them to resolve their style for any set of prop values.
       *
       * @param props The component props to use to resolve the style values.
       * @returns {*} The resolved component style.
       */
      resolveConnectedComponentStyle(props) {
        const styleNames = this.resolveStyleNames(props);
        return this.resolveStyle(this.context, props, styleNames)
          .componentStyle;
      }

      render() {
        // console.log('themeCache', themeCache);

        // if(componentStyleName == 'NativeBase.Text') {
        //   console.log(this.state.style);
        //   console.log(themeCache);
        // }

        const { addedProps, style } = this.state;
        return (
          <WrappedComponent
            {...this.props}
            {...addedProps}
            style={style}
            ref={this.setWrappedInstance}
          />
        );
      }
    }

    return hoistStatics(StyledComponent, WrappedComponent);
  };
};
