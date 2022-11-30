#import <Foundation/Foundation.h>
#import <AVFAudio/AVAudioPlayer.h>

@interface MyAudioPlayerImpl: NSObject
@property (strong, nonatomic, readwrite) AVAudioPlayer* player;
@property (strong, nonatomic, readwrite) NSData* recordingData;

- (void)playRecord;

@end
