#include <spdlog/spdlog.h>

#include "num-speaker.hpp"
#include "utils/logger.hpp"

void ConfigureLoggingEnviroment() {
    SetupLogger("AudioPlayer");
    SetupLogger("NumSpeaker");
    spdlog::set_level(spdlog::level::debug);
}

int main(int argc, char** argv) {
    ConfigureLoggingEnviroment();

    NumSpeaker speaker;
    speaker.Speak(1);
    return 0;
}
