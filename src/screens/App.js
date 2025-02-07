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
  const dbRef = database.get('notes');
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState([]);
  const [type, setType] = useState('add');
  const [selectedId, setSelectedId] = useState('');

  const clearValues = () => {
    setTitle('');
    setDescription('');
    setType('add');
    setSelectedId('');
  };

  const getAllNotes = () => {
    const notesData = dbRef;
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
      await dbRef.create(note => {
        note.note = title;
        note.description = description;
      });
    });
    console.log('Added successfully.');
    setShowCard(false);
    clearValues();
    getAllNotes();
  };

  const deleteNote = async id => {
    await database.write(async () => {
      const noteToDelete = await dbRef.find(id);
      await noteToDelete.destroyPermanently();
      getAllNotes();
    });
  };

  const updateNote = async () => {
    await database.write(async () => {
      const noteToUpdate = await dbRef.find(selectedId);
      await noteToUpdate.update(item => {
        item.note = title;
        item.description = description;
      });
      getAllNotes();
      clearValues();
      setShowCard(false);
    });
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <SafeAreaView style={style.occupyFull}>
      {/* /Add note card */}
      {showCard && (
        <View style={style.addNoteCard}>
          <Text style={style.title}>
            {type == 'add' ? 'Add Note' : 'Update Note'}
          </Text>
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
                clearValues();
              }}>
              <Text style={style.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.addBtn}
              onPress={() => {
                if (type == 'add') {
                  addNote();
                } else {
                  updateNote();
                }
              }}>
              <Text style={style.addNoteTxt}>
                {type == 'add' ? 'Add Note' : 'Update'}
              </Text>
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
                <View style={style.centerHorizontally}>
                  <Text style={style.cancelTxt}>{item.note}</Text>
                  <Text style={style.text15}>{item.description}</Text>
                </View>
                <View style={style.centerHorizontally}>
                  <Text
                    style={{color: 'blue'}}
                    onPress={() => {
                      setType('edit');
                      setTitle(item.note);
                      setDescription(item.description);
                      setSelectedId(item.id);
                      setShowCard(true);
                    }}>
                    Update
                  </Text>
                  <Text
                    style={{color: 'red', marginTop: 10}}
                    onPress={() => {
                      deleteNote(item.id);
                    }}>
                    Delete
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
      <TouchableOpacity
        style={style.addNoteBg}
        onPress={() => {
          clearValues();
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
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#E5E4E2'
  },
  text15: {fontSize: 15},
  centerHorizontally: {justifyContent: 'center'},
});

export default App;
