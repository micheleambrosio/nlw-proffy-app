import React, { useState, useEffect } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services';

import styles from './styles';

export default function TeacherList() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  async function loadFavorites() {
    const response = await AsyncStorage.getItem('favorites');
    if (response) {
      setFavorites(JSON.parse(response));
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [])

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(prevState => !prevState);
  }

  async function handleFilterSubmit() {
    const response = await api.get('/classes', {
      params: {
        subject,
        week_day: weekDay,
        time
      }
    });

    setTeachers(response.data);
    setIsFiltersVisible(false);
    loadFavorites();
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title='Proffys disponíveis' 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name='filter' size={20} color='#FFF' />
          </BorderlessButton>
        )}
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              placeholder='Qual a matéria?'
              placeholderTextColor='#c1bccc'
              value={subject}
              onChangeText={text => setSubject(text)}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Qual o dia?'
                  placeholderTextColor='#c1bccc'
                  value={weekDay}
                  onChangeText={text => setWeekDay(text)}
                /> 
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Qual horário?'
                  placeholderTextColor='#c1bccc'
                  value={time}
                  onChangeText={text => setTime(text)}
                /> 
              </View>
            </View>

            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => 
          <TeacherItem
            key={teacher.id}
            teacher={teacher}
            favorited={!!favorites.find((favorite: Teacher) => teacher.id === favorite.id)}
          />
        )}
      </ScrollView>
     </View>
  );
}
