const handleSubmit = async () => {
  const requiredFields = isEdit
    ? {
        Description: "scheme_description",
        Tax: "scheme_tax",
        Status: "scheme_tax",
      }
    : {
        Short: "scheme_short",
        Description: "scheme_description",
        Tax: "scheme_tax",
      };
  const missingFields = Object.entries(requiredFields).filter(
    ([label, field]) =>
      !formData[field]?.trim() && (!isEditMode || field !== "branch_short")
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
          `${BASE_URL}/api/panel-update-scheme/${schemeId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      : await axios.post(`${BASE_URL}/api/panel-create-scheme`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

    if (response?.data.code == 200) {
      toast({ title: "Success", description: response.data.msg });
      await queryClient.invalidateQueries(["schemes"]);

      if (!isEdit) {
        setFormData({
          scheme_short: "",
          scheme_description: "",
          scheme_tax: "",
          scheme_status: "",
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
      description: error.response?.data?.message || "Failed to submit scheme",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
