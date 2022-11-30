#ifndef TK_NUM_SPEAKER_HPP
#define TK_NUM_SPEAKER_HPP

#include <boost/noncopyable.hpp>
#include <spdlog/logger.h>


#include "audio-player.hpp"

namespace tk {
class NumSpeaker final: public boost::noncopyable {
public:
    explicit NumSpeaker();

    void Speak(int num);
private:
    std::shared_ptr<spdlog::logger> logger_;
    AudioPlayer player_;
};
}; // namespace tk


#endif
