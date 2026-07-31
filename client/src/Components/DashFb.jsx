import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";

export default function DashFb() {
  const { currentUser } = useSelector((state) => state.user);
  const [fbs, setFbs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [editFbUrl, setEditFbUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fbIdToDelete, setFbIdToDelete] = useState("");

  // Fetch all FB posts
  const fetchFbs = async () => {
    try {
      const res = await fetch("/api/fb/all");
      const data = await res.json();
      setFbs(Array.isArray(data) ? data : data.fbs || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFbs();
  }, []);

  // Delete FB post
  const handleDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/fb/delete/${fbIdToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setFbs((prev) => prev.filter((fb) => fb._id !== fbIdToDelete));
    } catch (error) {
      console.error(error);
    }
  };

  // Start editing
  const handleEdit = (fb) => {
    setEditingId(fb._id);
    setEditImage(fb.image);
    setEditFbUrl(fb.fbUrl);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditImage("");
    setEditFbUrl("");
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/fb/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: editImage, fbUrl: editFbUrl }),
      });
      if (!res.ok) throw new Error("Failed to update");
      handleCancel();
      fetchFbs();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle image file upload
 const handleImageChange = async (file) => {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("images", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    setEditImage(data.images[0]);
  } catch (error) {
    console.error(error);
    alert("Image upload failed");
  }
};

  return (
    <div className="max-w-5xl w-full mx-auto mt-10 p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Facebook Posts</h2>
        <Link to="/create-fb">
          <Button gradientDuoTone="pinkToOrange">+ Create FB Post</Button>
        </Link>
      </div>

      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Facebook URL</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>

        {fbs.map((fb) => (
          <Table.Body key={fb._id} className="divide-y">
            <Table.Row className="bg-white dark:bg-gray-800">
              <Table.Cell>
                {editingId === fb._id ? (
                  <div className="flex flex-col gap-2">
                    <img
                      src={editImage}
                      alt="preview"
                      className="w-32 h-20 object-cover rounded-md"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <img
                    src={fb.image}
                    alt="FB Post"
                    className="w-32 h-20 object-cover rounded-md"
                  />
                )}
              </Table.Cell>
              <Table.Cell>
                {new Date(fb.createdAt).toLocaleDateString()}
              </Table.Cell>

              <Table.Cell>
                {editingId === fb._id ? (
                  <input
                    type="text"
                    value={editFbUrl}
                    onChange={(e) => setEditFbUrl(e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                ) : (
                  <a
                    href={fb.fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {fb.fbUrl}
                  </a>
                )}
              </Table.Cell>

              <Table.Cell>
                {editingId === fb._id ? (
                  <div className="flex gap-2">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => handleUpdate(fb._id)}
                    >
                      Save
                    </Button>
                    <Button color="gray" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button color="teal" size="sm" onClick={() => handleEdit(fb)}>
                    <CiEdit />
                  </Button>
                )}
              </Table.Cell>

              <Table.Cell>
                <Button
                  color="failure"
                  size="sm"
                  onClick={() => {
                    setFbIdToDelete(fb._id);
                    setShowModal(true);
                  }}
                >
                  <IoTrashOutline />
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
