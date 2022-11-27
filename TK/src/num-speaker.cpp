#include "num-speaker.hpp"
#include "utils/logger.hpp"

namespace tk  {
NumSpeaker::NumSpeaker(): logger_(SetupLogger("NumSpeaker")), audio_player_{} {
    logger_->debug("Created");
}

void NumSpeaker::Speak(int num) {
    logger_->info("Requested speak num {}", num);
}

}; // namespace tk
