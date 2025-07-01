import React from 'react';
import { Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

// Define the shape of a todo item
interface Todo {
  id: number;
  title: string;
  background: string;
}

// Optional: define the store's shape if needed
interface Store {
  todos?: Todo[];
}

// Optional: define action types for dispatch
type Action =
  | { type: 'add_task'; payload: { id: number; color: string } };

export const Demo: React.FC = (): JSX.Element => {
  const { store, dispatch } = useGlobalReducer();

  return (
    <div className="container">
      <ul className="list-group">
        {store.todos?.map((item: Todo) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between"
            style={{ background: item.background }}
          >
            <Link to={`/single/${item.id}`}>Link to: {item.title}</Link>
            <p>
              Open file <code>./store.js</code> to see the global store that contains and updates the list of colors
            </p>
            <button
              className="btn btn-success"
              onClick={() =>
                dispatch({
                  type: 'add_task',
                  payload: { id: item.id, color: '#ffa500' },
                } as Action)
              }
            >
              Change Color
            </button>
          </li>
        ))}
      </ul>
      <br />
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
