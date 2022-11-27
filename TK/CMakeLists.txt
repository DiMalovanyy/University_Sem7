cmake_minimum_required(VERSION 3.5)

project(TK VERSION 0.0.1 LANGUAGES C CXX)

if (NOT APPLE)
    message(FATAL_ERROR "Build available only for OSX")
endif()

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

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
find_library(CORE_FOUNDATION CoreFoundation)
if (NOT CORE_FOUNDATION)
    message(FATAL_ERROR "Could not found CoreFoundation framework")
endif()

FetchContent_MakeAvailable(spdlog fmt)

file(GLOB_RECURSE SOURCE_FILES src/*.cpp src/*.c)

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
    ${CORE_FOUNDATION}
    ${AVF_AUDIO}
)
