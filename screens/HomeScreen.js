// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import styles from '../styles/styles';

const HomeScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Fetch user's name from Firestore
    const fetchUserName = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || '');
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.log('Error fetching user name:', error);
      }
    };

    // Determine greeting based on the time of day
    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting('Good morning');
      } else if (currentHour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };

    fetchUserName();
    determineGreeting();

   
    const taskRef = collection(firestore, 'todos');
    const q = query(taskRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks = [];
      querySnapshot.forEach((doc) => {
        const todo = doc.data();
        todo.id = doc.id;
        newTasks.push(todo);
      });
      setTodos(newTasks);
    });

    return unsubscribe;
  }, []);

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.todoContainer}
      onPress={() =>
        navigation.navigate('AddTask', { todo: item, isEdit: true })
      }
    >
      <Text style={styles.todoText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headertitle}>{`${greeting}, ${userName}!`}</Text>
      <FlatList
        data={todos}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('AddTask', { isEdit: false })}
      />
    </View>
  );
};

export default HomeScreen;
