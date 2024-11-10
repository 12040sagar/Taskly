import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import styles from '../styles/styles';
import Toast from 'react-native-toast-message';

const AddTaskScreen = ({ route, navigation }) => {
  const { todo, isEdit } = route.params;
  const [title, setTitle] = useState(isEdit ? todo.title : '');
  const userId = auth.currentUser.uid;

  const onSavePress = async () => {
    const taskRef = collection(firestore, 'todos');

    try {
      if (isEdit) {
        await updateDoc(doc(taskRef, todo.id), { title });
        Toast.show({
          type: 'success',
          text1: 'Task updated successfully',
        });
      } else {
        await addDoc(taskRef, {
          title,
          userId,
        });
        Toast.show({
          type: 'success',
          text1: 'Task added successfully',
        });
      }
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const onDeletePress = async () => {
    const taskRef = collection(firestore, 'todos');

    try {
      await deleteDoc(doc(taskRef, todo.id));
      Toast.show({
        type: 'success',
        text1: 'Task deleted successfully',
      });
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Whats your Task?"
        onChangeText={(text) => setTitle(text)}
        value={title}
      />
      <Button title="Save" onPress={onSavePress} />
      {isEdit && <Button title="Delete" onPress={onDeletePress} />}
    </View>
  );
};

export default AddTaskScreen;
