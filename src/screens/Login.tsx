import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import Typo from "../components/Typo";
import { colors, spacingX, spacingY } from "../constants/theme";
import { verticalScale } from "../utils/styling";
// import { At, Lock } from 'phosphor-react-native';
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View, Image, Linking } from "react-native";
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
          "https://softbook-backend.onrender.com/api/v1/admin/login",
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );
    
        const token = response.data?.token;
    
        if (!token) {
          Alert.alert("Login", "Token not received");
          return;
        }
    
        await storeToken(token);
    
        // Fetch admin profile
        try {
          const profileRes = await axios.get(
            "https://softbook-backend.onrender.com/api/v1/admin/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const adminProfile = profileRes.data?.admin;
    
          if (adminProfile?.subscription?.active === false) {
            Alert.alert("Subscription Inactive", "Your subscription is not active. Please renew to continue.");
            return;
          }
    
          navigation.replace("Tabs");
        } catch (profileError: any) {
          console.error("Profile fetch error:", profileError.response?.data);
          Alert.alert(
            "Profile Error",
            profileError.response?.data?.msg ||
              "Could not verify subscription status. Please contact support."
          );
        }
      } catch (error: any) {
        console.error("Login error:", error.response?.data);
        Alert.alert(
          "Login Failed",
          error.response?.data?.message || "Invalid credentials"
        );
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <ScreenWrapper>
      <TopNav2
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Image
                source={require('../assets/typo.png')}
                resizeMode="contain"
                style={styles.logo}
                onError={() => console.log('Image failed to load')}
              />
              {/* <Typo style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
                SoftBook
              </Typo> */}
            </View>
          }
        />
        {/* <BackButton iconSize={28} navigation={navigation} /> */}
        {/* <Image source={require('../assets/Icon.png')} style={styles.logo} /> */}
        <View style={styles.container}>
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
                Login now to track your business
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
        {/* <Typo size={14} color={colors.text} style={{alignSelf: "flex-end"}}>Forgot Password?</Typo> */}
        <Button onPress={handleSubmit} loading={isLoading} style = {{marginTop: 20}}>
                <Typo size={21} fontWeight={'600'} color={colors.white}>
                    Login
                </Typo>
            </Button>
        </View>

        {/* Input */}
        <View style={styles.footer}>
            <Typo size={15}>
                Don't have an account?
            </Typo>
                <Pressable onPress={() => Linking.openURL('https://www.softbook.co.in')}>
                    <Typo size={15} fontWeight={"700"} color={colors.primary}>Register</Typo>
                </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
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
