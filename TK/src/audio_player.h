#ifndef TK_AUDIO_PLAYER_HPP
#define TK_AUDIO_PLAYER_HPP

#include <boost/noncopyable.hpp>
#include <spdlog/logger.h>

#include <AVFAudio/AVAudioPlayer.h>

namespace tk {
    
class AudioPlayer final: boost::noncopyable {
public:
    explicit AudioPlayer();
private:
    std::shared_ptr<spdlog::logger> logger_;

    std::unique_ptr<AudioPlayer> player_;
};

}


#endif
