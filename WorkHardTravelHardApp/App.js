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
  const [working, setWorking] = useState();
  const [done, setDone] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
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
    console.log(await AsyncStorage.getItem(STORAGE_WORKING));
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
      [Date.now()]: { text, working, done },
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

  const insertToDo = (key) => {
    const newToDos = { ...toDos };
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
            style={{ ...styles.btnText, 
              color: working ? "white" : theme.grey }}
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
      />
      <ScrollView>
        {toDos &&
          Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <TouchableOpacity flex="10" onPress={() => checkToDo(key)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {toDos[key].done ? 
                <Fontisto name="checkbox-passive" size={24} color="white" />
                : <Fontisto name="checkbox-active" size={24} color="white" />}
                </TouchableOpacity>
                <Text
                style={toDos[key].done ? styles.toDoText : styles.toDoTextChecked}
                onPress={() => checkToDo(key)}>
                  {toDos[key].text}
                  </Text>
                <TouchableOpacity /*onPress={() => deleteToDo(key)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15}}*/>
                <EvilIcons name="pencil" size={18} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)} /*hitSlop={{ top: 15, bottom: 15, left: 15, right: 15}}*/>
                  <Fontisto name="trash" size={18} color={"white"} style={styles.iconStyless} />
                </TouchableOpacity>
              </View>
            ) : null
          )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  iconStyless: {
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

// 왜 toDoText, toDoTextChecked에 flex를 넣으면 모양이 딱 잡히는지 모르겠음

// 챌린지
// 1. work, tralvel 마지막 위치 기억, 재시작시 마지막 위치에서 시작할 수 있게



// 2. toDo 리스트 완료 상태로 만드는 f 만들기, 체크박스 취소선
// hint done : true/false object 에 추가해서
// https://icons.expo.fyi/Fontisto/checkbox-active
// https://icons.expo.fyi/Fontisto/checkbox-passive
// 이 두가지 done 상태에 따라서 아이콘 바꾸는 방식으로 체크 체크아웃 하게끔 하고
// 체크박스 아이콘 누르는걸로도 done t/f 바뀌게끔
// 완성



// 3. 유저가 text를 수정할 수 있게
// 삼항 연산자 만들어서 true일때는 text false면 textinput으로 바꾸는건 어떨까
// 처음부터 textinput으로 사용하고 연필 누르면 textinput 수정 상태 변경하게끔 하거나


// 공부 다시할 것
// const saveToDos = async (toSave) => {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
// };
// JSON.stringify(toSave) 이거 왜 해줘야 하는지