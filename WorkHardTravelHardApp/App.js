import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";
const STORAGE_WORKING = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [done, setDone] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    loadToDos();
    loadWorking();
  }, []);

  const travel = () => {
    setWorking(false);
    saveWorking(false);
  };

  const work = () => {
    setWorking(true);
    saveWorking(true);
  };

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const saveWorking = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_WORKING, JSON.stringify(toSave));
    // console.log(await AsyncStorage.getItem(STORAGE_WORKING));
  };

  const loadWorking = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_WORKING);
      setWorking(JSON.parse(s));
    } catch (e) {}
  }

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (e) {}
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, done, edit },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const checkToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = newToDos[key].done ? false : true;
    // setDone(!newToDos[key].done);
    // console.log(newToDos[key])
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const editToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].edit = newToDos[key].edit ? false : true
    // console.log(key, newToDos[key], )
    setToDos(newToDos);
    saveToDos(newToDos);
  }

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? "What do you have to do?" : "Where do you want to go?"
        }
        style={styles.input}
        // multiline??? ????????? ??? ?????? ?????? ???????????? ?????? ???????????? ????????? ?????? ??????????????? ????????????
      />
      <ScrollView>
        {toDos &&
          Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <TouchableOpacity
                  onPress={() => checkToDo(key)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {toDos[key].done ? (
                    <Fontisto name="checkbox-passive" size={24} color="white" />
                  ) : (
                    <Fontisto name="checkbox-active" size={24} color="white" />
                  )}
                </TouchableOpacity>
                <TextInput
                onSubmitEditing={editToDo}
                  style={
                    toDos[key].done ? styles.toDoText : styles.toDoTextChecked
                  }
                  returnKeyType="done"
                  // onPress={ () => checkToDo(key) }
                  editable={toDos[key].edit}
                  multiline={true}
                  value={toDos[key].text}
                  onChangeText={onChangeText}
                >
                  {/* {toDos[key].text} */}
                </TextInput>
                <EvilIcons.Button
                  onPress={() => editToDo(key)}
                  name="pencil" size={30} backgroundColor={theme.toDoBg}
                  color={toDos[key].edit ? "black" : "white"}
                  iconStyle={{ marginRight: 0 }}
                  style={{ padding: 5}}
                />
                <EvilIcons.Button
                  onPress={() => deleteToDo(key)}
                  name="trash" size={30} backgroundColor={theme.toDoBg}
                  iconStyle={{ marginRight: 0 }}
                  style={{ padding: 5 }}
                />
              </View>
            ) : null
          )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  iconStyle: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  scrollView: {
    // backgroundColor: 'pink',
    // marginHorizontal: 20,
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 10,
  },
  toDoTextChecked: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "line-through",
    flex: 1,
    marginLeft: 10,
  },
});

// ??? toDoText, toDoTextChecked??? flex??? ????????? ????????? ??? ???????????? ????????????

// ?????????
// 1. work, tralvel ????????? ?????? ??????, ???????????? ????????? ???????????? ????????? ??? ??????



// 2. toDo ????????? ?????? ????????? ????????? f ?????????, ???????????? ?????????
// hint done : true/false object ??? ????????????
// https://icons.expo.fyi/Fontisto/checkbox-active
// https://icons.expo.fyi/Fontisto/checkbox-passive
// ??? ????????? done ????????? ????????? ????????? ????????? ???????????? ?????? ???????????? ????????? ??????
// ???????????? ????????? ?????????????????? done t/f ????????????
// ??????



// 3. ????????? text??? ????????? ??? ??????
// ?????? ????????? ???????????? true????????? text false??? textinput?????? ???????????? ?????????
// ???????????? textinput?????? ???????????? ?????? ????????? textinput ?????? ?????? ??????????????? ?????????


// ?????? ????????? ???
// const saveToDos = async (toSave) => {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
// };
// JSON.stringify(toSave) ?????? ??? ????????? ?????????