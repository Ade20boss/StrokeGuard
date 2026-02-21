#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdint.h>

float calculate_sdnn_from_ble(uint16_t * raw_rr_array, int n){
    if (n < 2) return 0.0f;

    float* ms_intervals = (float*) malloc(n * sizeof(float));
    if (ms_intervals == NULL) return 0.0f;

    float sum_ms = 0.0f;
    for (int i = 0; i < n; i++){
        // Bluetooth uses 1/1024 second units. 
        // Conversion to ms: (val / 1024) * 1000
        ms_intervals[i] = (float)raw_rr_array[i] * 0.9765625f;
        sum_ms += ms_intervals[i];
    }

    float mean_ms = sum_ms / n;
    float sum_sq_diff = 0.0f;
    for (int i = 0; i < n; i++){
        float diff = ms_intervals[i] - mean_ms;
        sum_sq_diff += (diff * diff);
    }

    float sdnn = (float)sqrt(sum_sq_diff / (n - 1));
    free(ms_intervals);
    return sdnn;
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("{\"error\": \"Usage: ./engine <id> <rr_csv>\"}\n");
        return 1;
    }

    uint32_t patient_id = (uint32_t)atoi(argv[1]);
    char *raw_data = argv[2];

    // Count commas to determine array size
    int count = 1;
    for (int i = 0; raw_data[i]; i++) {
        if (raw_data[i] == ',') count++;
    }

    // Use uint16_t to match the BLE standard output
    uint16_t* rr_buffer = (uint16_t*)malloc(count * sizeof(uint16_t));
    if (rr_buffer == NULL) return 1;

    // Parse CSV string into the integer buffer
    int i = 0;
    char *token = strtok(raw_data, ",");
    while(token != NULL && i < count){
        rr_buffer[i++] = (uint16_t)atoi(token);
        token = strtok(NULL, ",");
    }

    // CALL THE NEW FUNCTION
    float hrv_result = calculate_sdnn_from_ble(rr_buffer, i);

    char * status;
    if (hrv_result < 20.0f) status = "RED";
    else if(hrv_result < 40.0f) status = "YELLOW";
    else status = "GREEN";

    printf("{\"patient_id\": %u, \"status\": \"%s\", \"hrv\": %.2f}\n", 
           patient_id, status, hrv_result);

    free(rr_buffer);
    return 0;
}
