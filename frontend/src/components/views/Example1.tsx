import React, { useEffect, useState } from "react";
import "../../styles/example1.css";
import { useNavigate } from "react-router-dom";
import IconSvg from "../icons/icons";
import gearIcon from "../icons/gearIcon";
import { useTranslation } from "../../useTranslation";
import { CertificateDto } from "../data/certificate";
import { apiClient } from "../data/client";
const Example1: React.FC = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<CertificateDto[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | undefined>(
    undefined
  );
  const [, setLoading] = useState(true);
  const [, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCertificates$GET$certificates();
        setCertificates(response.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const toggleDropdown = (certId: number | undefined) => {
    setOpenDropdownId(openDropdownId === certId ? undefined : certId);
  };

  const deleteCertificate = async (id: number) => {
    try {
      await apiClient.deleteCertificate(id);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((cert) => cert.id !== id)
      );
    } catch (err) {
      throw err;
    }
  };

  const confirmAndDelete = async (id: number) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await deleteCertificate(id);
        alert(t("delete_success"));
      } catch (error) {
        console.error("Failed to delete the certificate", error);
        alert(t("delete_failure"));
      }
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id !== undefined) {
      confirmAndDelete(id);
    } else {
      alert(t("undefined_id"));
    }
  };

  const handleEditClick = (id: number | undefined) => {
    if (id !== undefined) {
      navigate(`/CertificateForm/${id}`);
    } else {
      alert(t("undefined_id"));
    }
  };

  const handleCreateClick = () => {
    navigate(`/CertificateForm/0`);
  };

  const handleEdit = (cert: CertificateDto) => () => {
    console.log("cert 1 ", cert);
    handleEditClick(cert.id);
  };
  const handleDelete = (cert: CertificateDto) => () =>
    handleDeleteClick(cert.id);
  const handleToggleDropdown = (cert: CertificateDto) => () =>
    toggleDropdown(cert.id);

  return (
    <div className="container">
      <h2 className="header_h">{t("example1_header")}</h2>
      <button className="btn-create" onClick={handleCreateClick}>
        {t("new_certificate")}
      </button>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{t("supplier")}</th>
              <th>{t("certificate_type")}</th>
              <th>{t("valid_from")}</th>
              <th>{t("valid_to")}</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>
                  <div className="dropdown-container">
                    <IconSvg
                      Icon={gearIcon}
                      className="gear-icon cursor-pointer"
                      onClick={handleToggleDropdown(cert)}
                    />
                    {openDropdownId === cert.id && (
                      <div className="dropdown-menu">
                        <div className="dropdown-options">
                          <button
                            className="dropdown-button"
                            onClick={handleEdit(cert)}
                          >
                            {t("edit")}
                          </button>
                          <button
                            className="dropdown-button"
                            onClick={handleDelete(cert)}
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td>{cert.supplierId}</td>
                <td>{cert.certificateType}</td>
                <td>{new Date(cert.validFrom).toDateString()}</td>
                <td>{new Date(cert.validTo).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Example1;
