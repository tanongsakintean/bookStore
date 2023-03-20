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

export default function Shelve() {
  const [shelves, setShelves] = useState<Shelves[] | null>([]);
  const [change, setChange] = useState(0);
  const [shelve, setShelve] = useState<Shelves>({
    category: "",
    total_books: 0,
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
    if (shelve.category != "") {
      try {
        Axios.post(`http://localhost:3001/shelves`, shelve).then((res) => {
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

  const handleDelete = (shelf_id: number) => {
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
          Axios.delete(`http://localhost:3001/shelves/${shelf_id}`).then(
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
      }
    });
  };

  const handleEdit = () => {
    try {
      Axios.put(
        `http://localhost:3001/shelves/${shelve.shelf_id}`,
        shelve
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
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/shelves").then((res) => {
      setShelves(res.data);
    });
  }, [change]);

  return (
    <div className="p-5">
      <h1 className=" text-3xl font-bold text-center font-mono">
        รายการประเภทหนังสือ
      </h1>
      <div>
        <button
          onClick={() => {
            setShelve({
              category: "",
              total_books: 0,
              shelf_id: 0,
            } as Shelves);
            setIsAdd(true);
            openModal();
          }}
          className="p-1 mt-3 bg-green-500 text-white font-bold  rounded-lg  text-lg px-5"
        >
          {" "}
          เพิ่มประเภทหนังสือ
        </button>
      </div>
      <TableContainer className="mt-5 shadow-md border border-gray-300/50 ">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ลำดับ</TableCell>
              <TableCell align="center">ประเภท</TableCell>
              <TableCell align="center">จำนวนหนังสือ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shelves?.map((row, key) => (
              <TableRow
                key={row.shelf_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row" align="center">
                  {key + 1}
                </TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">{row.total_books}</TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => {
                      setShelve(row);
                      setIsAdd(false);
                      openModal();
                    }}
                    className="p-1 bg-yellow-500 text-white font-bold  rounded-lg  text-lg px-5"
                  >
                    {" "}
                    แก้ไข
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(row.shelf_id)}
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
                    แก้ไขข้อมูลประเภท
                  </Dialog.Title>
                  <div className="mt-2">
                    <form className=" space-y-5">
                      <div className="m-1">
                        <label>
                          ชื่อประเภท<span className=" text-red-500">*</span>
                        </label>{" "}
                        <input
                          placeholder="ชื่อเรื่อง"
                          type="text"
                          className=" shadow-md px-2  border border-gray-200 text-xl w-full outline-none"
                          value={shelve?.category}
                          onChange={(e) =>
                            setShelve({
                              ...shelve,
                              category: e.target.value,
                            } as Shelves)
                          }
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
                        เพิ่มปรเภทหนังสือ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit()}
                        type="button"
                        className=" mx-1 inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        แก้ไขปรเภทหนังสือ
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
