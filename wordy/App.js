import { StyleSheet,SafeAreaView,Text,StatusBar} from "react-native";
import { colors } from "./src/constants";
import Game from "./src/components/Game/Game";
import SplashScreen from 'react-native-splash-screen'
import React,{ useEffect } from "react";

export default function App() {
  useEffect(()=>{
    SplashScreen.hide()
  },[])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDEL</Text>
      <Game/>
     
    </SafeAreaView>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

});
