"use client";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axios/axios-instance";
import {
  ArrowLeft,
  Edit,
  FileSpreadsheet,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types for users
interface User {
  id?: string;
  codigo?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  tipo?: string;
  estado?: boolean;
  rolAsesor?: boolean;
  rolJurado?: boolean;
  rolRevisor?: boolean;
  rolesIds?: number[];
  carreras?: object[];
}
const ROL_ASESOR_ID = 1;
const ROL_JURADO_ID = 2;
const ROL_REVISOR_ID = 3;
const ROL_ALUMNO_ID = 6;
interface UserFromBack {
  roles: string[];
  id: string | number;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  tipoUsuario?: { nombre: string };
  activo: boolean;
}

export default function ConfiguracionUsuariosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("alumnos");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isConfirmUploadChecked, setIsConfirmUploadChecked] = useState(false);
  // New user form state
  const [formData, setFormData] = useState<User | null>(null);
  const [carreras, setCarreras] = useState<
    { carreraId: number; esCoordinador: boolean }[]
  >([]);

  useEffect(() => {
    const fetchCarrera = async () => {
      try {
        const response = await axiosInstance.get(
          "/usuario/getCarreraCoordinador",
        );
        type Carrera = { id: number };
        const ids = Array.isArray(response.data)
          ? response.data.map((c: Carrera) => c.id)
          : [response.data.id];
        const carrerasObj = ids.map((id: number) => ({
          carreraId: id,
          esCoordinador: false,
        }));
        setCarreras(carrerasObj);
      } catch (error) {
        console.error("Error al obtener carreras del coordinador:", error);
      }
    };
    fetchCarrera();
  }, []);
  const fetchUsuarios = async () => {
    try {
      const response = await axiosInstance.get("/usuario/find_all");
      const mappedUsers: User[] = response.data.map((u: UserFromBack) => ({
        id: String(u.id),
        codigo: u.codigoPucp,
        nombre: u.nombres,
        apellidoPaterno: u.primerApellido,
        apellidoMaterno: u.segundoApellido,
        email: u.correoElectronico,
        tipo: u.tipoUsuario?.nombre,
        estado: u.activo,
        roles: u.roles,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Reset form when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Filter users based on active tab and search query
  const filteredUsers = users.filter((user) => {
  const roles = (user as UserFromBack).roles as string[] | undefined;
  if (activeTab === "alumnos") {
    return (!roles || roles.length === 0) && user.tipo?.toLowerCase() === "alumno";
  }
  if (activeTab === "asesores") {
    return roles?.includes("Asesor");
  }
  if (activeTab === "jurados") {
    return roles?.includes("Jurado");
  }
  if (activeTab === "revisores") {
    return roles?.includes("Revisor");
  }
  return false;
}).filter((user) => {
  // Filtro de búsqueda
  if (!searchQuery) return true;
  
  const query = searchQuery.toLowerCase().trim();
  const queryWords = query.split(/\s+/);
  
  // Construir el texto completo del usuario para búsqueda
  const fullName = `${user.nombre || ""} ${user.apellidoPaterno || ""} ${user.apellidoMaterno || ""}`.toLowerCase().trim();
  const codigo = (user.codigo || "").toLowerCase();
  const email = (user.email || "").toLowerCase();
  
  // Si es una búsqueda de una sola palabra, buscar en todos los campos
  if (queryWords.length === 1) {
    return (
      fullName.includes(query) ||
      codigo.includes(query) ||
      email.includes(query)
    );
  }
  
  // Si son múltiples palabras, buscar coincidencias más inteligentes
  // Opción 1: Todas las palabras están en el nombre completo
  const allWordsInFullName = queryWords.every((word) => fullName.includes(word));
  
  // Opción 2: Coincidencia exacta con nombre + apellido(s)
  const exactNameMatch = fullName.includes(query);
  
  // Opción 3: Coincidencia con código o email
  const codeOrEmailMatch = codigo.includes(query) || email.includes(query);
  
  return allWordsInFullName || exactNameMatch || codeOrEmailMatch;
});

  const uploadUsuariosMasivo = async (file: File) => {
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const response = await axiosInstance.post(
        "/usuario/carga-masiva",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // Manejar la respuesta, por ejemplo:
      // setUsers([...users, ...response.data]);
      return response.data;
    } catch (error) {
      console.error("Error al cargar usuarios masivamente:", error);
      throw error;
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
      
      // Handle role assignment based on user type
      if (name === "tipo") {
        if (value === "Alumno") {
          // Alumno gets role 6 automatically
          updatedData.rolesIds = [ROL_ALUMNO_ID];
          // Reset professor roles
          updatedData.rolAsesor = false;
          updatedData.rolJurado = false;
          updatedData.rolRevisor = false;
        } else if (value === "Profesor") {
          // Profesor starts with no roles (will be set via checkboxes)
          updatedData.rolesIds = [];
          updatedData.rolAsesor = false;
          updatedData.rolJurado = false;
          updatedData.rolRevisor = false;
        }
      }
      
      return updatedData;
    });
  };

  // Open add user dialog
  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    
    // Determine user type based on active tab
    let userType: string;
    switch (activeTab) {
      case "alumnos":
        userType = "Alumno";
        break;
      case "asesores":
        userType = "Asesor";
        break;
      case "revisores":
        userType = "Revisor";
        break;
      default:
        userType = "Jurado";
        break;
    }

    // Initialize rolesIds based on user type
    let initialRolesIds: number[] = [];
    if (userType === "Alumno") {
      initialRolesIds = [ROL_ALUMNO_ID];
    }
    // Profesor starts with no roles, they are assigned via checkboxes

    setFormData({
      codigo: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      tipo: userType,
      estado: true,
      rolAsesor: false,
      rolJurado: false,
      rolRevisor: false,
      rolesIds: initialRolesIds,
      carreras: carreras.map((c) => ({
        carreraId: c.carreraId, 
        esCoordinador: c.esCoordinador,
      })),
    });
    setIsAddUserDialogOpen(true);
  };

  // Open edit user dialog
  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      codigo: user.codigo,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      email: user.email,
      tipo: user.tipo,
      estado: user.estado,
      rolAsesor: user.rolAsesor || false,
      rolJurado: user.rolJurado || false,
      rolRevisor: user.rolRevisor || false,
    });
    setIsAddUserDialogOpen(true);
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/usuario/delete/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setUploadError("Error al eliminar el usuario");
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Submit user form
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) {
      setUploadError("Datos del formulario incompletos.");
      return;
    }

    if (isEditMode && currentUser) {
      // Update existing user
      try {
        await axiosInstance.put(`/usuario/update/${currentUser.id}`, {
          codigoPucp: formData.codigo,
          nombres: formData.nombre,
          primerApellido: formData.apellidoPaterno,
          segundoApellido: formData.apellidoMaterno,
          correoElectronico: formData.email,
          tipoUsuarioNombre: formData.tipo,
          tipoDedicacionId: 1,
          rolesIds: formData.rolesIds || [],
          carreras: formData.carreras || [],
          activo: true,
        });

        // Actualiza el usuario localmente
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? {
                  ...user,
                  codigo: formData.codigo,
                  nombre: formData.nombre,
                  apellidoPaterno: formData.apellidoPaterno,
                  apellidoMaterno: formData.apellidoMaterno,
                  email: formData.email,
                  tipo: formData.tipo,
                  estado: formData.estado,
                }
              : user,
          ),
        );
        setIsAddUserDialogOpen(false);
      } catch (error) {
        setUploadError("Error al actualizar el usuario");
        console.error("Error al actualizar usuario:", error);
      }
    } else {
      try {
        const response = await axiosInstance.post("/usuario/create", {
          codigoPucp: formData.codigo,
          nombres: formData.nombre,
          primerApellido: formData.apellidoPaterno,
          segundoApellido: formData.apellidoMaterno,
          correoElectronico: formData.email,
          tipoUsuarioNombre: formData.tipo,
          tipoDedicacionId: 1,
          rolesIds: formData.rolesIds || [],
          carreras: formData.carreras || [],
          activo: true,
        });

        // Agrega el nuevo usuario a la lista local
        const newUser = {
          id: String(response.data.id),
          codigo: response.data.codigoPucp,
          nombre: response.data.nombres,
          apellidoPaterno: response.data.primerApellido,
          apellidoMaterno: response.data.segundoApellido,
          email: response.data.correoElectronico,
          tipo: response.data.tipoUsuario?.nombre,
          estado: response.data.activo,
        };
        setUsers([...users, newUser]);
        setIsAddUserDialogOpen(false);
      } catch (error) {
        setUploadError("Error al crear el usuario");
        console.error("Error al crear usuario:", error);
      }
    }
  };

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  // Process file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Por favor seleccione un archivo para cargar");
      return;
    }

    try {
      const nuevosUsuarios = await uploadUsuariosMasivo(selectedFile);
      setUsers([...users, ...nuevosUsuarios]);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al cargar usuarios masivamente:", error);
      setUploadError("Error al cargar usuarios masivamente");
    }
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header with back button and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Configuración de Usuarios</h1>
        </div>
      </div>

      {/* Main content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Administre los usuarios del sistema. Puede agregar usuarios
            manualmente o cargar un archivo CSV/XLSX.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs and actions */}
      <div className="flex flex-col space-y-6">
        <Tabs
          defaultValue="alumnos"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="alumnos">Alumnos</TabsTrigger>
              <TabsTrigger value="asesores">Asesores</TabsTrigger>
              <TabsTrigger value="jurados">Jurados</TabsTrigger>
              <TabsTrigger value="revisores">Revisores</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Carga Masiva
              </Button>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellidos</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.codigo}
                          </TableCell>
                          <TableCell>{user.nombre}</TableCell>
                          <TableCell>
                            {user.apellidoPaterno} {user.apellidoMaterno}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.estado ? "default" : "secondary"}
                              className={
                                user.estado
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {user.estado ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id!)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No se encontraron usuarios
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isAddUserDialogOpen}
        onOpenChange={() => setIsAddUserDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modifique los datos del usuario existente."
                : "Complete el formulario para agregar un nuevo usuario al sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    placeholder="Ej: 20101235"
                    value={formData?.codigo}
                    onChange={handleInputChange}
                    required
                    maxLength={8}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Usuario</Label>
                  <Select
                    value={formData?.tipo}
                    onValueChange={(value) => handleSelectChange("tipo", value)}
                    disabled={isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alumno">Alumno</SelectItem>
                      <SelectItem value="Profesor">Profesor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData?.tipo === "Profesor" && (
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rol-asesor"
                        checked={formData?.rolAsesor || false}
                        onCheckedChange={(checked) => {
                          const checkedBool = !!checked;
                          setFormData((prev) => {
                            const roles = new Set(prev?.rolesIds || []);
                            if (checkedBool) {
                              roles.add(ROL_ASESOR_ID);
                            } else {
                              roles.delete(ROL_ASESOR_ID);
                            }
                            return {
                              ...prev,
                              rolAsesor: checkedBool,
                              rolesIds: Array.from(roles),
                            };
                          });
                        }}
                      />
                      <Label htmlFor="rol-asesor">Asesor</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rol-jurado"
                        checked={formData?.rolJurado || false}
                        onCheckedChange={(checked) => {
                          const checkedBool = !!checked;
                          setFormData((prev) => {
                            const roles = new Set(prev?.rolesIds || []);
                            if (checkedBool) {
                              roles.add(ROL_JURADO_ID);
                            } else {
                              roles.delete(ROL_JURADO_ID);
                            }
                            return {
                              ...prev,
                              rolJurado: checkedBool,
                              rolesIds: Array.from(roles),
                            };
                          });
                        }}
                      />
                      <Label htmlFor="rol-jurado">Jurado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rol-revisor"
                        checked={formData?.rolRevisor || false}
                        onCheckedChange={(checked) => {
                          const checkedBool = !!checked;
                          setFormData((prev) => {
                            const roles = new Set(prev?.rolesIds || []);
                            if (checkedBool) {
                              roles.add(ROL_REVISOR_ID);
                            } else {
                              roles.delete(ROL_REVISOR_ID);
                            }
                            return {
                              ...prev,
                              rolRevisor: checkedBool,
                              rolesIds: Array.from(roles),
                            };
                          });
                        }}
                      />

                      <Label htmlFor="rol-revisor">Revisor</Label>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData?.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
                  <Input
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    placeholder="Apellido Paterno"
                    value={formData?.apellidoPaterno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    placeholder="Apellido Materno"
                    value={formData?.apellidoMaterno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData?.estado ? "Activo" : "Inactivo"}
                    onValueChange={(value) =>
                      handleSelectChange("estado", value)
                    }
                    disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@pucp.edu.pe"
                  value={formData?.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? "Guardar Cambios" : "Agregar Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Carga Masiva de Usuarios</DialogTitle>
            <DialogDescription>
              Cargue un archivo con la lista de usuarios, asegúrese de que el
              archivo siga el siguiente formato:<br></br>
              Nombres ApellidoPaterno ApellidoMaterno Correo CodigoPUCP
              TipoUsuario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Extensiones soportadas:{" "}
                <span className="font-medium">.csv, .xlsx</span>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
              />
              {!selectedFile ? (
                <div>
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm">
                    Arrastre y suelte su archivo aquí o
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Seleccionar Archivo
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <FileSpreadsheet className="h-6 w-6 mr-2 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => {
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="confirm-upload"
                checked={isConfirmUploadChecked}
                onCheckedChange={(checked) =>
                  setIsConfirmUploadChecked(!!checked)
                }
              />
              <Label htmlFor="confirm-upload">
                Confirmo que los datos son correctos y deseo cargarlos al
                sistema
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !isConfirmUploadChecked}
            >
              Cargar Usuarios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
