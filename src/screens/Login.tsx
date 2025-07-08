import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import Typo from "../components/Typo";
import { colors, spacingX, spacingY } from "../constants/theme";
import { verticalScale } from "../utils/styling";
// import { At, Lock } from 'phosphor-react-native';
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View, Image } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import axios from 'axios';
import { storeToken } from '../utils/storage';
import TopNav2 from "../components/TopNav2";

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: LoginProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState(""); 
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email || !password) {
          Alert.alert("Login", "Please fill all the fields");
          return;
        }
      
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://192.168.0.100:3000/api/v1/admin/login",
                {
                  email,
                  password,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
      
          const token = response.data?.token;
      
          if (token) {
            await storeToken(token);
            navigation.replace("Tabs"); // or your main screen
          } else {
            Alert.alert("Login", "Token not received");
          }
        } catch (error: any) {
          console.error("Login Error", error);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
          Alert.alert("Login Failed", error.response?.data?.msg || "Invalid credentials");
        } finally {
          setIsLoading(false);
        }
      };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <TopNav2
          title={
            <Image
              source={require('../assets/typo.png')}
              resizeMode="contain"
              style={styles.logoNav}
            />
          }
        />
        {/* <BackButton iconSize={28} navigation={navigation} /> */}
        {/* <Image source={require('../assets/Icon.png')} style={styles.logo} /> */}

        <View style={{ gap: 5, marginTop: "20%" }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
                Login now to track all your expenses
            </Typo>

        {/* Input */}
        <Input 
            placeholder="Enter your email" 
            value={email}
            onChangeText={setEmail}
        />
        <Input 
            placeholder="Enter your password" 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Typo size={14} color={colors.text} style={{alignSelf: "flex-end"}}>Forgot Password?</Typo>
        <Button onPress={handleSubmit} loading={isLoading}>
                <Typo size={21} fontWeight={'700'} color={colors.white}>
                    Login
                </Typo>
            </Button>
        </View>

        {/* Input */}
        <View style={styles.footer}>
            <Typo size={15}>
                Don't have an account?
            </Typo>
                <Pressable>
                    <Typo size={15} fontWeight={"700"} color={colors.primary}>Sign up</Typo>
                </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  logoNav:{
    width: 200,
    height: 200,
  },
    logo:{
        width: 100,
        height: 100,
        alignSelf: 'flex-start',
        marginTop: spacingY._20,
    },
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
