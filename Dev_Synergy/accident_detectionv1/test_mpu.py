import smbus2, time, math

bus = smbus2.SMBus(1)
MPU_ADDR = 0x68

# Wake up MPU6050
bus.write_byte_data(MPU_ADDR, 0x6B, 0)

def read_word(reg):
    high = bus.read_byte_data(MPU_ADDR, reg)
    low = bus.read_byte_data(MPU_ADDR, reg+1)
    val = (high << 8) + low
    if val >= 0x8000:
        val = -((65535 - val) + 1)
    return val

while True:
    ax = read_word(0x3B) / 16384.0 * 9.81
    ay = read_word(0x3D) / 16384.0 * 9.81
    az = read_word(0x3F) / 16384.0 * 9.81
    print(f"AX={ax:.2f}  AY={ay:.2f}  AZ={az:.2f}")
    time.sleep(0.2)
