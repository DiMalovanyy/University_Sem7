#ifndef AUDIO_PLAYER_HPP
#define AUDIO_PLAYER_HPP

#include <boost/noncopyable.hpp>
#include <boost/filesystem/path.hpp>
#include <spdlog/logger.h>
#include <memory>

using unique_void_ptr = std::unique_ptr<void, void(*)(void const*)>;
class AudioPlayer final: boost::noncopyable {
public:
    explicit AudioPlayer();

    void AppendRecord(const boost::filesystem::path& record_file);
    void ResetRecord();
    void Play();
private:
    unique_void_ptr pImpl_;
    std::shared_ptr<spdlog::logger> logger_;
};

#endif
