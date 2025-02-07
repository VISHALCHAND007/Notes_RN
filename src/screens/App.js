import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {database} from '../data/database';

const App = () => {
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState([]);

  const getAllNotes = () => {
    const notesData = database.get('notes');
    notesData
      .query()
      .observe()
      .forEach(item => {
        const temp = [];
        item.forEach(data => {
          temp.push(data._raw);
        });
        setNotes(temp);
      });
  };

  const addNote = async () => {
    console.log(title, description);
    await database.write(async () => {
      await database.get('notes').create(note => {
        note.note = title;
        note.description = description;
      });
    });
    console.log('Added successfully.');
    setShowCard(false);
    getAllNotes();
  };

  const deleteNote = () => {};

  const updateNote = () => {};

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <SafeAreaView style={style.occupyFull}>
      {/* /Add note card */}
      {showCard && (
        <View style={style.addNoteCard}>
          <Text style={style.title}>Add Note</Text>
          <TextInput
            placeholder="Enter note title"
            style={style.textInput}
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <TextInput
            placeholder="Enter note description"
            style={style.textInput}
            value={description}
            onChangeText={text => setDescription(text)}
          />
          {/* buttons */}
          <View style={style.rowStyle}>
            <TouchableOpacity
              style={style.cancelBtn}
              onPress={() => {
                setShowCard(false);
              }}>
              <Text style={style.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.addBtn} onPress={addNote}>
              <Text style={style.addNoteTxt}>Add Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {notes && (
        <FlatList
          data={notes}
          renderItem={({item, index}) => {
            return (
              <View style={style.flatListItem}>
                <Text style={style.cancelTxt}>{item.note}</Text>
                <Text style={style.text15}>{item.description}</Text>
              </View>
            );
          }}
        />
      )}
      <TouchableOpacity
        style={style.addNoteBg}
        onPress={() => {
          setShowCard(true);
        }}>
        <Text style={style.addNoteTxt}>Add New Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  occupyFull: {flex: 1},
  addNoteBg: {
    width: '100%',
    height: 60,
    bottom: 20,
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNoteTxt: {fontSize: 18, color: 'white'},
  addNoteCard: {
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    shadowOpacity: 0.5,
    alignSelf: 'center',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    paddingBottom: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
  },
  textInput: {
    width: '90%',
    borderColor: 'black',
    borderWidth: 1,
    paddingStart: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  rowStyle: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  addBtn: {
    backgroundColor: 'purple',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelBtn: {
    borderColor: 'purple',
    borderWidth: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addNoteTxt: {color: 'white', fontSize: 17},
  cancelTxt: {color: 'purple', fontSize: 17},
  flatListItem: {
    width: '90%',
    height: 80,
    borderWidth: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingStart: 10
  },
  text15: {fontSize: 15},
});

export default App;
