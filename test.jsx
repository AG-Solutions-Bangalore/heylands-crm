const handleDeleteRow = (id) => {
  setDeleteItemId(id);
  setDeleteConfirmOpen(true);
};
const handleDelete = async () => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/panel-delete-invoice/${deleteItemId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.code == 200) {
      toast({
        title: "Success",
        description: response.data.msg,
        variant: "default",
      });
      fetchContractData();
      setDeleteItemId(null);
      setDeleteConfirmOpen(false);
    } else {
      toast({
        title: "Error",
        description: response.data.msg,
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete invoice.",
      variant: "destructive",
    });
  }
};
