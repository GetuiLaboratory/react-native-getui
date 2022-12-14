require 'json'
pjson = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name            = "GtSdkRN"
  s.version         = pjson["version"]
  s.homepage        = "https://github.com/GetuiLaboratory/react-native-getui"
  s.summary         = pjson["description"]
  s.license         = pjson["license"]
  s.author          = { "huminios" => "330793655@qq.com" }
  
  s.ios.deployment_target = '8.0'

  s.source          = { :git => "https://github.com/GetuiLaboratory/react-native-getui.git" }
  s.source_files    = 'ios/RCTGetuiModule/RCTGetuiModule/*.{h,m}'
  s.preserve_paths  = "*.js"
  s.frameworks      = 'SystemConfiguration', 'CFNetwork','CoreTelephony','CoreLocation','AVFoundation','Security','AdSupport'
  s.weak_frameworks = 'UserNotifications','AppTrackingTransparency','Network'
  s.libraries       = 'z','sqlite3.0','c++','resolv'
  s.vendored_frameworks = "ios/RCTGetuiModule/RCTGetuiModule/GTSDK.xcframework"
  s.requires_arc = true
  s.swift_versions = ['5']

  s.dependency 'React'
end
