import React, { useState } from 'react';
import { View, Image, Text, Linking, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import api from '../../services';

export interface Teacher {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string
}

interface TeacherItemsProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemsProps> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited); 
  
  function handleLinkToWhatsApp() {
    try {
      Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);   
    } catch (error) {
      console.error('Error to open WhatsApp');
    }

    api.post('connections', {
      user_id: teacher.id
    });
  }

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');

    let favoritesList: Teacher[] = [];

    if (favorites) {
      favoritesList = JSON.parse(favorites);
    }
    
    if (isFavorited) {  
      const favoriteIndex = favoritesList.findIndex((item: Teacher) => item.id === teacher.id);
      favoritesList.splice(favoriteIndex, 1);

      setIsFavorited(false);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));

      return;
    }

    favoritesList.push(teacher);

    setIsFavorited(true);
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: teacher.avatar }} />
      
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>
       {teacher.bio}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {'   '}
          <Text style={styles.priceValue}>R$ {teacher.cost.toFixed(2)}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton 
            onPress={handleToggleFavorite} 
            style={[
              styles.favoriteButton, 
              isFavorited ? styles.favorited : {}
            ]}
          >
            {isFavorited
              ? <Image source={unfavoriteIcon} />
              : <Image source={heartOutlineIcon} />
            }
          </RectButton>

          <RectButton onPress={handleLinkToWhatsApp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
}

export default TeacherItem