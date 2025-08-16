import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { IoTrashOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
export default function DashTravel() {
  const [travels, setTravels] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [travelIdToDelete, setTravelIdToDelete] = useState("");

  // Fetch travels
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch("/api/travel/gettravels?startIndex=0&limit=9");
        const data = await res.json();
        if (res.ok) {
          setTravels(data.travels);
          if (data.travels.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTravels();
  }, []);

  // Show more travels
  const handleShowMore = async () => {
    const startIndex = travels.length;
    try {
      const res = await fetch(
        `/api/travel/gettravels?startIndex=${startIndex}&limit=9`
      );
      const data = await res.json();
      if (res.ok) {
        setTravels((prev) => [...prev, ...data.travels]);
        if (data.travels.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete travel
  const handleDeleteTravel = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/travel/deletetravel/${travelIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setTravels((prev) =>
          prev.filter((travel) => travel._id !== travelIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {travels.length > 0 ? (
        <>
          <Link to={"/create-travelpost"}>
            <Button
              type="button"
              gradientDuoTone="cyanToBlue"
              className="min-w-12 mb-3"
            >
              Create a Travel Post
            </Button>
          </Link>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Travel image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell>Trip Date</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>

            {travels.map((travel) => (
              <Table.Body key={travel._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(travel.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/travel/${travel.slug}`}>
                      <img
                        src={travel.image}
                        alt={travel.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/travel/${travel.slug}`}
                    >
                      {travel.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{travel.location}</Table.Cell>
                  <Table.Cell>
                    {new Date(travel.tripDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setTravelIdToDelete(travel._id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IoTrashOutline className="text-lg cursor-pointer" />
                    </button>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      to={`/update-travel/${travel._id}`}
                      className="text-teal-500 hover:text-teal-700"
                    >
                      <CiEdit className="text-lg cursor-pointer" />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no travel posts yet!</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this travel post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteTravel}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
