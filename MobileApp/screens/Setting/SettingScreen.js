import { View, Text } from "react-native";
import React from "react";

import { Button } from "../../components";

const SettingScreen = ({ route }) => {
  const { setLogIn } = route.params;
  const onLogOutPressed = () => {
    setLogIn(false);
  };

  return (
    <View>
      <Text>SettingScreen</Text>
      <Button text="Log out" onPress={onLogOutPressed} />
    </View>
  );
};

export default SettingScreen;
