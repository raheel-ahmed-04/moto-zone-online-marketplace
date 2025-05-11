import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Table,
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Alert
} from "reactstrap";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css"; // You'll need to create this CSS file

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("buyers");
    const [buyers, setBuyers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();


    // Check if user is admin
    useEffect(() => {
        const checkAdmin = () => {
            const isAdminUser = localStorage.getItem("isAdmin") === "true";
            setIsAdmin(isAdminUser);

            if (!isAdminUser) {
                navigate("/home");
            }
        };

        checkAdmin();
    }, [navigate]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch buyers
                const { data: buyersData, error: buyersError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("role", "buyer");

                if (buyersError) throw buyersError;
                setBuyers(buyersData || []);

                // Fetch sellers
                const { data: sellersData, error: sellersError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("role", "seller");

                if (sellersError) throw sellersError;
                setSellers(sellersData || []);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    // Toggle between tabs
    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    // User management state
    const [modal, setModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "buyer",
        status: "active"
    });

    // Toggle modal
    const toggleModal = () => setModal(!modal);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Open edit modal
    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "buyer",
            status: user.status || "active"
        });
        toggleModal();
    };

    // Create new user
    const handleCreate = () => {
        setCurrentUser(null);
        setFormData({
            name: "",
            email: "",
            role: activeTab === "buyers" ? "buyer" : "seller",
            status: "active"
        });
        toggleModal();
    };

    // Save user (create or update)
    const handleSave = async () => {
        try {
            if (currentUser) {
                // Update existing user
                const { error } = await supabase
                    .from("users")
                    .update({
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        status: formData.status,
                        updated_at: new Date()
                    })
                    .eq("id", currentUser.id);

                if (error) throw error;
            } else {
                // Create new user
                const { error } = await supabase
                    .from("users")
                    .insert([{
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        // status: formData.status,
                        // created_at: new Date()
                    }]);

                if (error) throw error;
            }

            // Refresh data
            const { data: buyersData } = await supabase
                .from("users")
                .select("*")
                .eq("role", "buyer");

            const { data: sellersData } = await supabase
                .from("users")
                .select("*")
                .eq("role", "seller");

            setBuyers(buyersData || []);
            setSellers(sellersData || []);

            toggleModal();
        } catch (err) {
            console.error("Error saving user:", err);
            setError(err.message);
        }
    };

    // Delete user
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const { error } = await supabase
                    .from("users")
                    .delete()
                    .eq("id", id);

                if (error) throw error;

                // Update state to remove the deleted user
                if (activeTab === "buyers") {
                    setBuyers(buyers.filter(buyer => buyer.id !== id));
                } else {
                    setSellers(sellers.filter(seller => seller.id !== id));
                }
            } catch (err) {
                console.error("Error deleting user:", err);
                setError(err.message);
            }
        }
    };

    if (!isAdmin) {
        return <div>Redirecting to home page...</div>;
    }

    return (
        <Container className="admin-page mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {error && (
                <Alert color="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === "buyers" ? "active" : ""}
                        onClick={() => toggle("buyers")}
                    >
                        Buyers
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === "sellers" ? "active" : ""}
                        onClick={() => toggle("sellers")}
                    >
                        Sellers
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="buyers">
                    <Row className="mb-3">
                        <Col>
                            <h3>Buyers List</h3>
                        </Col>
                        <Col className="text-end">
                            {/* <Button color="primary" onClick={handleCreate}>
                                Add New Buyer
                            </Button> */}
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center my-5">Loading buyers...</div>
                    ) : (
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buyers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No buyers found. Add your first buyer!
                                        </td>
                                    </tr>
                                ) : (
                                    buyers.map((buyer) => (
                                        <tr key={buyer.id}>
                                            <td>{buyer.name}</td>
                                            <td>{buyer.email}</td>
                                            <td>
                                                <span className={`status-badge ${buyer.status}`}>
                                                    {buyer.status}
                                                </span>
                                            </td>
                                            <td>{new Date(buyer.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    color="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(buyer)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(buyer.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </TabPane>

                <TabPane tabId="sellers">
                    <Row className="mb-3">
                        <Col>
                            <h3>Sellers List</h3>
                        </Col>
                        <Col className="text-end">
                            {/* <Button color="primary" onClick={handleCreate}>
                                Add New Seller
                            </Button> */}
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center my-5">Loading sellers...</div>
                    ) : (
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No sellers found. Add your first seller!
                                        </td>
                                    </tr>
                                ) : (
                                    sellers.map((seller) => (
                                        <tr key={seller.id}>
                                            <td>{seller.name}</td>
                                            <td>{seller.email}</td>
                                            <td>
                                                <span className={`status-badge ${seller.status}`}>
                                                    {seller.status}
                                                </span>
                                            </td>
                                            <td>{new Date(seller.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    color="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(seller)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(seller.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </TabPane>
            </TabContent>

            {/* Add/Edit User Modal */}
            {/* <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                    {currentUser ? "Edit User" : "Add New User"}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="role">Role</Label>
                            <Input
                                type="select"
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input
                                type="select"
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal> */}
        </Container>
    );
};

export default AdminPage;
