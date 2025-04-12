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
          `${BASE_URL}/api/panel-update-contract/${decryptedId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      : await axios.post(`${BASE_URL}/api/panel-create-contract`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

    if (response?.data.code == 200) {
      toast({ title: "Success", description: response.data.msg });
      await queryClient.invalidateQueries(["items"]);

      if (!isEditMode) {
        setFormData({
          branch_short: "",
          branch_name: "",
          branch_address: "",
          contract_year: "",
          contract_no: "",
          contract_year: currentYear,
          contract_date: getTodayDate(),
          contract_order_type: "",
          contract_pono: "",
          contract_buyer: "",
          contract_buyer_add: "",
          contract_consignee: "",
          contract_consignee_add: "",
          contract_container_size: "",
          contract_product: "",
          contract_loading_port: "",
          contract_loading_country: "",
          contract_destination_port: "",
          contract_destination_country: "",
          contract_payment_terms: "",
          contract_delivery_terms: "",
          contract_qty_inmt: "",
          contract_validity: "",
          contract_marking: "",
          contract_insurance: "",
          contract_pack_type: "",
          contract_packing: "",
          contract_currency: "",
          contract_sign: "",
          contract_position: "",
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
      description: error.response?.data?.message || "Failed to submit item",
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
