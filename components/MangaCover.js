import React, { useState } from 'react'
import { View, Image, Modal, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'

const MangaCover = ({ mangaId, mangaDetails }) => {
  const [isCoverModalVisible, setCoverModalVisible] = useState(false)

  const toggleCoverModal = () => {
    setCoverModalVisible(!isCoverModalVisible)
  }

  return (
    <View style={{ flexShrink: 1, flex: 1 }}>
      <TouchableOpacity onPress={toggleCoverModal}>
        <Image
          source={{
            uri: `https://uploads.mangadex.org/covers/${mangaId}/${mangaDetails.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`
          }}
          style={styles.coverImage}
        />
      </TouchableOpacity>

      <Modal visible={isCoverModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={toggleCoverModal}>
            <Image
              source={{
                uri: `https://uploads.mangadex.org/covers/${mangaId}/${mangaDetails.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`
              }}
              style={styles.modalImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

MangaCover.propTypes = {
  mangaId: PropTypes.string.isRequired,
  mangaDetails: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  coverImage: {
    width: 128,
    height: 182,
    borderRadius: 5,
    marginRight: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalImage: {
    width: 353,
    height: 502
  }
})

export default MangaCover
