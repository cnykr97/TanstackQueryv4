import { ActivityIndicator, Button, FlatList, ListRenderItem, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import { Todo, createTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';


export default function TabOneScreen() {

  const [todo, setTodo] = useState('')
  const queryClient = useQueryClient()

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  })

  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      console.log('Success: ', data)
      queryClient.invalidateQueries({queryKey: ['todos']})
    } 
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (data) => {
      console.log('Success: ', data)
      queryClient.invalidateQueries({queryKey: ['todos']})
    } 
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (data) => {
      console.log('Success: ', data)
      queryClient.invalidateQueries({queryKey: ['todos']})
    } 
  })

  const addTodo = () => {
    addMutation.mutate(todo)
  }

  const renderTodo: ListRenderItem<Todo>  = ({ item }) => {

    const deleteTodo = (id: number) => {
      deleteMutation.mutate(id)
    }

    const toggleDone = () => {
      updateMutation.mutate({...item, done: !item.done})
    }

    return (
      <View >
        <TouchableOpacity style={styles.todoContainer} onPress={toggleDone} >
          <Ionicons name={item.done ? 'checkmark-circle' : 'checkmark-circle-outline'} size={24} color={item.done ? 'green' : 'black'} />
          <Text> {item.text} </Text>
          <Ionicons name='trash' size={24} color={'darkred'} onPress={() => deleteTodo(item.id)} />
        </TouchableOpacity>
      </View>
    )
      
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 20}} >
        <TextInput placeholder='add Todo..' style={styles.addTodo} onChangeText={setTodo} value={todo} />
        <Button title='Add' onPress={addTodo} />
      </View>
      {todosQuery.isLoading ? <ActivityIndicator color={'#341349'} size={'large'} /> : null}
      {todosQuery.isError ? <Text>Sorry, we couldn't found the context you want :(</Text> : null}
      {todosQuery.data && 
        <FlatList
          data={todosQuery.data}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id.toString()}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  todoContainer: {width: 330, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginBottom: 15, backgroundColor: 'lightgrey', borderRadius: 10},
  addTodo: {width: 280, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, padding: 10}
});
