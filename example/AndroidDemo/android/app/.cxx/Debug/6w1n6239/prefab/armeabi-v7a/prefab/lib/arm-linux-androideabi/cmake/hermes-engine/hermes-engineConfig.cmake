if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/yangsihao/.gradle/caches/8.13/transforms/b034aef65a970793e0e053d494c15a32/transformed/hermes-android-0.79.1-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/yangsihao/.gradle/caches/8.13/transforms/b034aef65a970793e0e053d494c15a32/transformed/hermes-android-0.79.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

