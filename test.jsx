const token = useApiToken();

const handleSubmit = async () => {
  // const requiredFields = isEditMode
  //   ? {
  //     gr_code_status: "bagType_status",
  //     }
  //   : {
  //       Description: "gr_code_des",
  //       Product Name: "product_name",
  //     };
  // const missingFields = Object.entries(requiredFields).filter(
  //   ([label, field]) => !formData[field]?.trim()
  // );

  // if (missingFields.length > 0) {
  //   toast({
  //     title: "Missing Required Fields",
  //     description: (
  //       <div className="flex flex-col gap-1">
  //         {missingFields.map(([label], index) => (
  //           <div key={index}>• {label}</div>
  //         ))}
  //       </div>
  //     ),
  //     variant: "destructive",
  //   });
  //   return;
  // }

  setIsLoading(true);
  try {
    const response = isEditMode
      ? await axios.put(
          `${BASE_URL}/api/panel-update-item/${decryptedId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      : await axios.post(`${BASE_URL}/api/panel-create-item`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

    if (response?.data.code == 200) {
      toast({ title: "Success", description: response.data.msg });
      await queryClient.invalidateQueries(["items"]);

      if (!isEditMode) {
        setFormData({
          item_code:"",
          item_description: "",
          item_buyer: "",
          item_gsp: "",
          item_packing_id: "",
          item_country: "",
          item_rate_per_pc: "",
          item_box_id: "",
          item_board: [],
          item_barcode: "",
          item_gross_wt: "",
          item_category: "",
          item_top: "",
          item_hsnCode: "",
          item_note: "",
        });
      }
      setOpen(false);
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
      description:
        error.response?.data?.message || "Failed to submit item",
      variant: "destructive",
    });
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

const handleSubmit = async () => {
  const requiredFields = {
    ContainerSIze: "containerSize",
    Status: "containerSize_status",
  };
  const missingFields = Object.entries(requiredFields).filter(
    ([label, field]) =>
      !formData[field]?.trim() &&
      (!isEditMode || field !== "containerSize_status") // skip state_name in edit mode
  );

  if (missingFields.length > 0) {
    toast({
      title: "Missing Required Fields",
      description: (
        <div className="flex flex-col gap-1">
          {missingFields.map(([label], index) => (
            <div key={index}>• {label}</div>
          ))}
        </div>
      ),
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = isEditMode
      ? await axios.put(
          `${BASE_URL}/api/panel-update-container-size/${containerId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      : await axios.post(
          `${BASE_URL}/api/panel-create-container-size`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

    if (response.data.code === 200) {
      toast({
        title: "Success",
        description: response.data.msg,
      });

      queryClient.invalidateQueries(["containersizes"]);
      setOpen(false);

      if (!isEditMode) {
        setFormData({ state_name: "", state_no: "", state_status: "Active" });
      }
    } else {
      toast({
        title: "Error",
        description: response.data.msg,
        variant: "destructive",
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: err.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
