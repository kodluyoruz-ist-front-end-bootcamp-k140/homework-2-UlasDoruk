import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";
import {Pagination} from "../pagination/pagination"

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(true);
  const [orderTittle, setOrderTittle] = useState(true);
  const [orderCompleted, setOrderCompleted] = useState(true);
  // const [page,setPage] = useState([])
  const [todo, setTodo] = useState(null);
  // Şu anki sayfayı gösteren variable
  const [currentPage, setCurrentPage] = useState(1);
  // sayfaların kaçar adet data bulunduğunu gösteren variable
  const [postsPerPage] = useState(50);

  useEffect(() => {
    loadData();
  }, []);

  // Son postun index'i
  const indexOfLastPost = currentPage * postsPerPage;
  // İlk postun index'i
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // Sayfalara dağılacak item sayısı (slice ile)
  const currentPosts = items.slice(indexOfFirstPost, indexOfLastPost);
  //
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const loadData = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const renderBody = () => {
    return (
      <React.Fragment>
        {currentPosts
          .sort((a, b) => a.id - b.id)
          .map((item, i) => {
            return (
              <tr key={i}>
                <th scope="row">{item.id}</th>
                <td>{item.title}</td>
                <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
                <td>
                  <Button
                    className="btn btn-xs btn-danger"
                    onClick={() => onRemove(item.id)}
                  >
                    Sil
                  </Button>
                  <Button
                    className="btn btn-xs btn-warning"
                    onClick={() => onEdit(item)}
                  >
                    Düzenle
                  </Button>
                </td>
              </tr>
            );
          })}
      </React.Fragment>
    );
  };

  const renderTable = () => {
    return (
      <>
        <Button onClick={onAdd}>Ekle</Button>
        <br></br>
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => sortingId(items.id)}>
                ID
              </th>
              <th scope="col" onClick={() => sortingTittle(items.title)}>
                Başlık
              </th>
              <th scope="col" onClick={() => sortingCompleted(items.completed)}>
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
          {/* Pagination component implamentasyonu */}
          <Pagination
            // Pagination propsları
            postsPerPage={postsPerPage}
            totalPosts={items.length}
            paginate={paginate}
          />
        </table>
      </>
    );
  };

  /* Sorting Function */
  const sortingId = (col) => {
    if (orderId === true) {
      const sorted = [...items].sort((a, b) => (a.id < b.id ? -1 : 1));
      setOrderId(false);
      setItems(sorted);
    } else if (orderId === false) {
      const sorted = [...items].sort((a, b) => (a.id > b.id ? -1 : 1));
      setOrderId(true);
      setItems(sorted);
    }
  };
  const sortingTittle = (col) => {
    if (orderTittle === true) {
      const sorted = [...items].sort((a, b) => (a.title < b.title ? -1 : 1));
      setOrderTittle(false);
      setItems(sorted);
    } else if (orderTittle === false) {
      const sorted = [...items].sort((a, b) => (a.title > b.title ? -1 : 1));
      setOrderTittle(true);
      setItems(sorted);
    }
  };

  const sortingCompleted = (col) => {
    if (orderCompleted === true) {
      const sorted = [...items].sort((a, b) =>
        a.completed < b.completed ? -1 : 1
      );
      setOrderCompleted(false);
      setItems(sorted);
    } else if (orderCompleted === false) {
      const sorted = [...items].sort((a, b) =>
        a.completed > b.completed ? -1 : 1
      );
      setOrderCompleted(true);
      setItems(sorted);
    }
  };

  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert("Ekleme işlemi başarıyla gerçekleşti.");
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id == id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? "Yükleniyor...." : todo ? renderEditForm() : renderTable()}</>
  );
}
