import { Text, View } from "react-native";

import React from 'react';

type MyComponentProps = {
  message: string;
};

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    return <h1>{this.props.message}</h1>;
  }
}

export default MyComponent;
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
