
#include <spdlog/spdlog.h>
#include <spdlog/sinks/stdout_color_sinks.h>

static inline std::shared_ptr<spdlog::logger> SetupLogger(const std::string& logger_name) {
    auto logger = spdlog::get(logger_name);
    if (!logger) {
        logger = std::make_shared<spdlog::logger>(logger_name, std::make_shared<spdlog::sinks::stdout_color_sink_mt>());
        spdlog::register_logger(logger);
    }
    return logger;
}
