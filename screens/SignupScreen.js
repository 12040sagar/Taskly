import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import styles from '../styles/styles';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male'); 

  const onSignupPress = async () => {
    if (!name || !address || !gender) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;
      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        name: name,
        address: address,
        gender: gender,
      });
      // Navigate to Home screen upon successful signup
      navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        onChangeText={(text) => setAddress(text)}
        value={address}
      />

      <Text style={{ marginVertical: 10 }}>Gender:</Text>
      <Picker
        selectedValue={gender}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (6+ characters)"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={onSignupPress} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
