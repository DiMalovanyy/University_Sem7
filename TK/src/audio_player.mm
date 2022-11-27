#include "audio_player.hpp"
#include "utils/logger.hpp"


tk::AudioPlayer::AudioPlayer(): logger_(SetupLogger("AudioPlayer")), player_(nullptr) {
    logger_->debug("Created");

}
