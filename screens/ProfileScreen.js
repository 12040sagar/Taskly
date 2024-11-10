// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/styles';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setName(data.name);
          setAddress(data.address);
          setGender(data.gender);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log('Error getting user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const onLogoutPress = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  const onSavePress = async () => {
    try {
      const docRef = doc(firestore, 'users', user.uid);
      await updateDoc(docRef, {
        name: name,
        address: address,
        gender: gender,
      });
      setUserData({ ...userData, name, address, gender });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.log('Error updating user data:', error);
      alert('Failed to update profile.');
    }
  };

  const onCancelPress = () => {
    // Revert changes
    setName(userData.name);
    setAddress(userData.address);
    setGender(userData.gender);
    setIsEditing(false);
  };

  if (!userData) {
    return (
      <View style={[styles.container, localStyles.centerContent]}>
        <Text style={styles.title}>Profile</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Get the first letter of the user's name
  const initialLetter = userData.name ? userData.name.charAt(0).toUpperCase() : '';

  return (
    <View style={[styles.container, localStyles.centerContent]}>
      {/* Placeholder for profile picture */}
      <View style={localStyles.avatar}>
        <Text style={localStyles.avatarText}>{initialLetter}</Text>
      </View>

      {/* User Details */}
      {isEditing ? (
        <>
          {/* Editable Fields */}
          <TextInput
            style={localStyles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={localStyles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <Text style={{ marginVertical: 10 }}>Gender:</Text>
          <Picker
            selectedValue={gender}
            style={localStyles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>

          {/* Save and Cancel Buttons */}
          <View style={localStyles.buttonRow}>
            <TouchableOpacity style={localStyles.saveButton} onPress={onSavePress}>
              <Text style={localStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={localStyles.cancelButton} onPress={onCancelPress}>
              <Text style={localStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={localStyles.name}>{userData.name}</Text>
          <Text style={localStyles.email}>{userData.email}</Text>
          <Text style={localStyles.info}>Address: {userData.address}</Text>
          <Text style={localStyles.info}>Gender: {userData.gender}</Text>

          {/* Edit and Logout Buttons */}
          <View style={localStyles.buttonRow}>
            <TouchableOpacity style={localStyles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={localStyles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={localStyles.logoutButton} onPress={onLogoutPress}>
              <Text style={localStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    paddingTop: 50,
  },
  avatar: {
    backgroundColor: '#1B95E0',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  picker: {
    width: '80%',
    height: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
  },
  editButton: {
    backgroundColor: '#1B95E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
