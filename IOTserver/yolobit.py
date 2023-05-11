from mqtt import *
from yolobit import *
button_a.on_pressed = None
button_b.on_pressed = None
button_a.on_pressed_ab = button_b.on_pressed_ab = -1
import music
from event_manager import *
from machine import Pin, SoftI2C
from aiot_dht20 import DHT20

def on_mqtt_message_receive_callback__room1_slash_fan_(th_C3_B4ng_tin):
  pin2.write_analog(round(translate(int(th_C3_B4ng_tin), 0, 100, 0, 1023)))

def on_mqtt_message_receive_callback__room1_slash_light_(th_C3_B4ng_tin):

  if (int(th_C3_B4ng_tin)) == 0:
    display.set_all('#000000')
  else:
    display.set_all('#ffffff')

def on_mqtt_message_receive_callback__speaker_(th_C3_B4ng_tin):

  if (int(th_C3_B4ng_tin)) == 0:
    music.stop()
  elif (int(th_C3_B4ng_tin)) == 1:
    music.play(['D3:1'], wait=True)
  else:
    music.play(['G3:1'], wait=True)
  music.stop()

event_manager.reset()

aiot_dht20 = DHT20(SoftI2C(scl=Pin(22), sda=Pin(21)))

def on_event_timer_callback_Q_Z_c_S_q():
  global th_C3_B4ng_tin
  aiot_dht20.read_dht20()
  mqtt.publish('heat', (aiot_dht20.dht20_temperature()))
  mqtt.publish('light', (round(translate((pin0.read_analog()), 0, 4095, 0, 100))))

event_manager.add_timer_event(5000, on_event_timer_callback_Q_Z_c_S_q)

def on_button_a_pressed():
  mqtt.publish('door',0)
button_a.on_pressed = on_button_a_pressed
def on_button_b_pressed():
  mqtt.publish('door',1)

button_b.on_pressed = on_button_b_pressed
if True:
  mqtt.connect_wifi('L3 - L4', '55557777')
  mqtt.connect_broker(server='io.adafruit.com', port=1883, username='thanhthien412', password='aio_uguT767kjg6Fsfv9WRoOBavNMa57')

while True:
  mqtt.on_receive_message('room1-slash-fan', on_mqtt_message_receive_callback__room1_slash_fan_)
  mqtt.on_receive_message('room1-slash-light', on_mqtt_message_receive_callback__room1_slash_light_)
  mqtt.on_receive_message('speaker', on_mqtt_message_receive_callback__speaker_)
  event_manager.run()