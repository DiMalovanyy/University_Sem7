#ifndef TK_AUDIO_CONVERTER_H
#define TK_AUDIO_CONVERTER_H


typedef struct {
    char filename[256];
    char fileformat[16];
} sound_file_t;


int concat_mp3_files(const sound_file_t* files, int files_amount, sound_file_t* result_file) {

    return 0;
}


#endif
