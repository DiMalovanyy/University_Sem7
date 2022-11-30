
#include "audio-player.hpp"
#import "audio-player.mm.h"

#include "utils/logger.hpp"

@implementation MyAudioPlayerImpl

- (instancetype)init {
    self = [super init];
    if (self) {
        _player = [[AVAudioPlayer alloc] initWithContentsOfURL: 
                        [[NSURL alloc] 
                            initWithString: @"sample.mp3"
                        ] 
                        error:nil
        ];
        _player.volume = 0.5;
    }
    return self;
}

- (void)playRecord {
    BOOL prepareRelult = [_player prepareToPlay];
    if (!prepareRelult) {
        return;
    }
    BOOL result = [_player play];
    if (!result) {
        return;
    }
    NSLog(@"Start playing: %@", _player.url.path);
    while (_player.playing) {}
}

- (void)dealloc {
    if (_player) {
        [_player dealloc];
    }
    [super dealloc];
}

@end

template<typename T>
auto unique_void(T * ptr) -> unique_void_ptr{
    return unique_void_ptr(ptr, [](void const * data) {
            [(id)data dealloc];
    });
}

AudioPlayer::AudioPlayer(): 
    logger_(SetupLogger("AudioPlayer")), 
    pImpl_(unique_void( 
        [[MyAudioPlayerImpl alloc] init]
    )) {
}

void AudioPlayer::Play() {
    [(id)pImpl_.get() playRecord ];
}
