cmake_minimum_required(VERSION 3.5)

project(TK VERSION 0.0.1 LANGUAGES CXX C OBJC)

if (NOT APPLE)
    message(FATAL_ERROR "Build available only for OSX")
endif()

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
list(APPEND CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake")

set(FETCHCONTENT_QUIET FALSE)
set(FETCHCONTENT_TRY_FIND_PACKAGE_MODE ALWAYS)
include(FetchContent)

FetchContent_Declare(fmt
	GIT_REPOSITORY https://github.com/fmtlib/fmt.git
	GIT_TAG master
	GIT_PROGRESS TRUE
)

FetchContent_Declare(spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG "v1.x"
    GIT_PROGRESS TRUE
)

find_package(Boost REQUIRED)

find_library(AVF_AUDIO AVFAudio)
if (NOT AVF_AUDIO) 
    message(FATAL_ERROR "Could not found AVFAudio framework")
endif()

find_library(FOUNDATION Foundation)
if (NOT FOUNDATION) 
    message(FATAL_ERROR "Could not found foundation framework")
endif()

find_package(FFmpeg REQUIRED)
if (NOT ${FOUND_FFmpeg})
    message(FATAL_ERROR "Could not found ffmpeg library")
endif()

FetchContent_MakeAvailable(spdlog fmt)

set(PRESETS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/presets)
set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/src)
file(GLOB_RECURSE SOURCE_FILES
    ${SRC_DIR}/*.cpp
    ${SRC_DIR}/*.c
    ${SRC_DIR}/*.mm
)


set(TARGET_NAME ${PROJECT_NAME}_bin)
add_executable(${TARGET_NAME} ${SOURCE_FILES})
set_target_properties(${TARGET_NAME} PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)

target_link_libraries(${TARGET_NAME} PRIVATE 
    spdlog::spdlog
    fmt::fmt
    ${Boost_LIBRARIES}
    ${FOUNDATION}
    ${AVF_AUDIO}
    ${FFMPEG_LIBRARIES}
)

target_include_directories(${TARGET_NAME} PRIVATE ${FFMPEG_INCLUDE_DIRS})
