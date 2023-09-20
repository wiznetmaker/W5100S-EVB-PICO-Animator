# Pico🍓Animator with W5100S-EVB-Pico and Arducam

Pico🍓Animator, now enhanced with the power of W5100S-EVB-PICO and Arducam, brings the magic of anime transformation to images with the convenience of online access. This project, built on [React JavaScript library](https://reactjs.org/), seamlessly integrates [TensorFlow.js](https://www.tensorflow.org/js) to bring the AnimeGAN experience to a broader audience.

![image](https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator/assets/115054808/9aa97c8b-7bad-4b51-b836-4eec1048d547)

[**Waiting for domain approval from js.org!**](https://js.org) 



## About PicoAnimator

Under the hood, PicoAnimator uses the [AnimeGAN model](https://github.com/TachibanaYoshino/AnimeGAN) powered by [TensorFlow.js](https://www.tensorflow.org/js). The model leveraged here is sourced directly from the original AnimeGAN's release. If you're looking to run this locally, the model is available in the `public` directory. Creating new models? Simply export them from TensorFlow and use the tools [TensorFlow.js](https://www.tensorflow.org/js) offers for conversion.

![image](https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator/assets/115054808/0a8ade31-a075-430e-bd8d-78e1a2d1c843)

*Source image taken from [AnimeGAN](https://github.com/TachibanaYoshino/AnimeGAN) Github repo*


## Hardware Configuration

For those interested in the hardware specifics and setup, here's how the W5100S-EVB-Pico and Arducam OV2640 are interconnected:
![image](https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator/assets/115054808/bd4b597a-2ad2-4a23-9f7c-c34a7224c75b)

**SPI1 Configuration for ArduCam OV2640:**
- CS --> GPIO 13
- MOSI --> GPIO 11
- MISO --> GPIO 12
- SCLK --> GPIO 10

**I2C Configuration for ArduCam OV2640:**
- SDA --> GPIO 8
- SCL --> GPIO 9

For a deep dive into the code that makes this communication possible, you can find everything openly available at [this GitHub repository](https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator/tree/master/CIRCUITPY).

### Using ethernet by W5100S

```python
def w5x00_init():
    ##SPI0
    SPI0_SCK = board.GP18
    SPI0_TX = board.GP19
    SPI0_RX = board.GP16
    SPI0_CSn = board.GP17

    ##reset
    W5x00_RSTn = board.GP20

    print("Wiznet5k (DHCP)")

    # Setup your network configuration below
    # random MAC, later should change this value on your vendor ID
    MY_MAC = (0x00, 0x01, 0x02, 0x03, 0x04, 0x05)
    IP_ADDRESS = (192, 168, 0, 5)
    SUBNET_MASK = (255, 255, 255, 0)
    GATEWAY_ADDRESS = (192, 168, 0, 1)
    DNS_SERVER = (8, 8, 8, 8)

    ethernetRst = digitalio.DigitalInOut(W5x00_RSTn)
    ethernetRst.direction = digitalio.Direction.OUTPUT

    led = digitalio.DigitalInOut(board.GP25)
    led.direction = digitalio.Direction.OUTPUT

    # For Adafruit Ethernet FeatherWing
    cs = digitalio.DigitalInOut(SPI0_CSn)
    spi_bus = busio.SPI(SPI0_SCK, MOSI=SPI0_TX, MISO=SPI0_RX)

    # Reset W5500 first
    ethernetRst.value = False
    time.sleep(1)
    ethernetRst.value = True


    # Initialize ethernet interface without DHCP
    eth = WIZNET5K(spi_bus, cs, is_dhcp=True, mac=MY_MAC)

    # Set network configuration
    #eth.ifconfig = (IP_ADDRESS, SUBNET_MASK, GATEWAY_ADDRESS, DNS_SERVER)

    print("Chip Version:", eth.chip)
    print("MAC Address:", [hex(i) for i in eth.mac_address])
    print("My IP address is:", eth.pretty_ip(eth.ip_address))
    print("Done!")

    return eth, led
```

This is written in CircuitPython. If you're looking for the necessary libraries, they can be downloaded from [CircuitPython's official library collection](https://circuitpython.org/libraries). Furthermore, the uf2 for W5100s-evb-pico can be sourced directly from [here](https://circuitpython.org/board/wiznet_w5100s_evb_pico/).



## Image Transformation Example

![image](https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator/assets/115054808/a9c7de84-90e0-4a83-b48e-35ed4598c58e)


> Source IU image borrowed from the official Yidam Entertainment.



## Developers' Corner

Thanks to the openness of the previous project manager, TonyLianLong of AnimeGAN.js, I was able to navigate and continue the project with ease, even as a React beginner. In the same spirit of collaboration, I'm sharing all the code and guiding you on how to kickstart this project.

Before diving in, ensure you have **node.js** and **npm** installed on your system as prerequisites.

To get started:
1. Open your VS Code.
2. Perform a `git clone` of the project repository.
3. Once cloned, navigate to the root directory and run `npm start`.

Upon executing the above steps, the app should launch in development mode. Access it via [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the application.


---

This project has been inspired and built upon the foundation laid by the original [AnimeGAN.js](https://github.com/TonyLianLong/AnimeGAN.js) and [AnimeGAN project on GitHub](https://github.com/TachibanaYoshino/AnimeGAN). All credits to the original authors and contributors. This README is tailored for the modified version utilizing W5100S-EVB-PICO and Arducam.
