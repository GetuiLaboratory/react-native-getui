cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB rnoh_gtpush_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_gtpush SHARED ${rnoh_gtpush_SRC})
target_include_directories(rnoh_gtpush PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_gtpush PUBLIC rnoh)