"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import Swal from "sweetalert2";
import Axios from "axios";
import { Book, Shelves } from "@/types";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function Books() {
  const [shelves, setShelves] = useState<Shelves[] | null>([]);
  const [change, setChange] = useState(0);
  const [oldId, setOldId] = useState(0);
  const [book, setBook] = useState<Book>({
    id: 0,
    category: "",
    total_books: "",
    title: "",
    author: "",
    shelf_id: 0,
  });
  const [books, setBooks] = useState<Book[] | null>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleAdd = () => {
    if (book.author != "" && book.shelf_id != 0 && book.title != "") {
      try {
        Axios.post(`http://localhost:3001/books`, book).then((res) => {
          let { message, status } = res.data;
          if (status) {
            Swal.fire({
              icon: "success",
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: message,
            });
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        closeModal();
        setChange(change + 1);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "โปรดกรอกข้อมูลให้ครบถ้วน",
      });
    }
  };

  const handleDelete = (id: number, shelf_id: number) => {
    Swal.fire({
      icon: "info",
      title: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "ใช่",
      denyButtonText: `ยกเลิก`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          Axios.delete(
            `http://localhost:3001/books/${id}?shelf_id=${shelf_id}`
          ).then((res) => {
            let { message, status } = res.data;
            if (status) {
              Swal.fire({
                icon: "success",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: message,
              });
            }
          });
        } catch (error) {
          console.log(error);
        } finally {
          closeModal();
          setChange(change + 1);
        }
      }
    });
  };

  const handleEdit = () => {
    try {
      Axios.put(`http://localhost:3001/books/${book?.id}/${oldId}`, book).then(
        (res) => {
          let { message, status } = res.data;
          if (status) {
            Swal.fire({
              icon: "success",
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: message,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
      setChange(change + 1);
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/books").then((res) => {
      setBooks(res.data);
    });

    Axios.get("http://localhost:3001/shelves").then((res) => {
      setShelves(res.data);
    });
  }, [change]);

  return (
    <div className="p-5">
      <h1 className=" text-3xl font-bold text-center font-mono">
        รายการหนังสือ
      </h1>
      <div>
        <button
          onClick={() => {
            setBook({
              id: 0,
              category: "",
              total_books: "",
              title: "",
            } as Book);
            setIsAdd(true);
            openModal();
          }}
          className="p-1 mt-3 bg-green-500 text-white font-bold  rounded-lg  text-lg px-5"
        >
          {" "}
          เพิ่มหนังสือ
        </button>
      </div>
      <TableContainer className="mt-5 shadow-md border border-gray-300/50 ">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ลำดับ</TableCell>
              <TableCell align="center">ชื่อเรื่อง</TableCell>
              <TableCell align="center">คนแต่ง</TableCell>
              <TableCell align="center">ประเภท</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books?.map((row, key) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row" align="center">
                  {key + 1}
                </TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.author}</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => {
                      setBook(row);
                      setOldId(row.shelf_id);
                      setIsAdd(false);
                      openModal();
                    }}
                    className="p-1 bg-yellow-500 text-white font-bold  rounded-lg  text-lg px-5"
                  >
                    {" "}
                    แก้ไข
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(row.id, row.shelf_id)}
                    className="p-1 bg-red-500 text-white font-bold  rounded-lg  text-lg px-5"
                  >
                    {" "}
                    ลบ
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* modal Edit */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl text-center font-medium leading-6 text-gray-900"
                  >
                    แก้ไขข้อมูลหนังสือ
                  </Dialog.Title>
                  <div className="mt-2">
                    <form className=" space-y-5">
                      <div className="m-1">
                        <label>
                          ชื่อเรื่อง<span className=" text-red-500">*</span>
                        </label>{" "}
                        <input
                          placeholder="ชื่อเรื่อง"
                          type="text"
                          className=" shadow-md px-2  border border-gray-200 text-xl w-full outline-none"
                          value={book?.title}
                          onChange={(e) =>
                            setBook({ ...book, title: e.target.value } as Book)
                          }
                          required
                        />
                      </div>

                      <div className="m-1">
                        <label>
                          ประเภท<span className=" text-red-500">*</span>
                        </label>{" "}
                        <Listbox
                          value={book?.shelf_id}
                          onChange={(value: any) => {
                            setBook({
                              ...book,
                              shelf_id: value.shelf_id,
                              category: value.category,
                            } as Book);
                          }}
                        >
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <span className="block truncate">
                                {book?.category}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {shelves?.map((item, idx) => (
                                  <Listbox.Option
                                    key={idx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-amber-100 text-amber-900"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={item}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {item.category}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>

                      <div className="m-1">
                        <label>
                          ผู้แต่ง<span className=" text-red-500">*</span>
                        </label>{" "}
                        <input
                          placeholder="ผู้แต่ง"
                          type="text"
                          className=" shadow-md px-2  border border-gray-200 text-xl w-full outline-none"
                          value={book?.author}
                          onChange={(e) => {
                            setBook({
                              ...book,
                              author: e.target.value,
                            } as Book);
                          }}
                          required
                        />
                      </div>
                    </form>
                  </div>

                  <div className="mt-4 flex  justify-end">
                    {isAdd ? (
                      <button
                        onClick={() => handleAdd()}
                        type="button"
                        className=" mx-1 inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        เพิ่มหนังสือ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit()}
                        type="button"
                        className=" mx-1 inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        แก้ไข
                      </button>
                    )}
                    <button
                      type="button"
                      className=" mx-1 inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
