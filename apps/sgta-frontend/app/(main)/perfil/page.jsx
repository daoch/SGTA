'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenSquare, Upload, X, Plus, Link as LinkIcon, Check, Info, AlertCircle, Save } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data for statistics
const advisingStats = {
  activeTheses: 5,
  completedTheses: 12,
  totalStudents: 17,
  averageRating: 4.8,
};

export default function AdvisorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showImageCropDialog, setShowImageCropDialog] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Academic areas options
  const academicAreas = [
    "Ciencias de la Computación",
    "Sistemas de Información",
    "Ingeniería de Software",
    "Tecnologías de Información",
    "Inteligencia Artificial",
    "Redes y Comunicaciones"
  ];

  // Interest topics options
  const interestTopicsOptions = [
    "Inteligencia Artificial",
    "Machine Learning",
    "Automatización Robótica",
    "Procesamiento de Lenguaje Natural",
    "Visión por Computadora",
    "Ciencia de Datos",
    "Internet de las Cosas",
    "Computación en la Nube",
    "Ciberseguridad",
    "Desarrollo Web",
    "Aplicaciones Móviles",
    "Blockchain"
  ];

  // State for personal info
  const [personalInfo, setPersonalInfo] = useState({
    nombres: "Juan Carlos",
    primerApellido: "Pérez",
    segundoApellido: "García",
    correo: "juan.perez@universidad.edu",
    linkedin: "https://linkedin.com/in/juanperez",
    github: "https://github.com/juanperez",
    researchGate: "https://researchgate.net/profile/Juan-Perez",
    biografia: "Doctor en Ciencias de la Computación con especialidad en Inteligencia Artificial. Experiencia de 10 años en proyectos de investigación relacionados con Machine Learning y Natural Language Processing."
  });

  // Original data for cancel operation
  const [originalData, setOriginalData] = useState({
    personalInfo: {...personalInfo},
    selectedAreas: [],
    interestTopics: [],
  });

  // State for selected areas
  const [selectedAreas, setSelectedAreas] = useState([
    "Ciencias de la Computación",
    "Inteligencia Artificial"
  ]);

  // State for interest topics
  const [interestTopics, setInterestTopics] = useState([
    "Inteligencia Artificial",
    "Machine Learning",
    "Procesamiento de Lenguaje Natural"
  ]);

  // State for form validation
  const [errors, setErrors] = useState({
    biografia: "",
    linkedin: "",
    github: "",
    researchGate: "",
    newTopic: "",
  });

  // State for new topic input
  const [newTopic, setNewTopic] = useState("");
  const [newCustomTopic, setNewCustomTopic] = useState("");
  const [newArea, setNewArea] = useState("");

  // Handle tab change
  const handleTabChange = (value) => {
    if (isEditing && hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
      // Store the tab we want to switch to
      setActiveTab(value);
    } else {
      setActiveTab(value);
    }
  };

  // Begin editing mode
  const handleEditClick = () => {
    setOriginalData({
      personalInfo: {...personalInfo},
      selectedAreas: [...selectedAreas],
      interestTopics: [...interestTopics],
    });
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  // Cancel editing and revert changes
  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      resetChanges();
    }
  };

  // Reset all changes
  const resetChanges = () => {
    setPersonalInfo({...originalData.personalInfo});
    setSelectedAreas([...originalData.selectedAreas]);
    setInterestTopics([...originalData.interestTopics]);
    setErrors({
      biografia: "",
      linkedin: "",
      github: "",
      researchGate: "",
      newTopic: "",
    });
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  // Continue editing when user cancels the unsaved changes dialog
  const handleContinueEditing = () => {
    setShowUnsavedChangesDialog(false);
  };

  // Discard changes when user confirms in the unsaved changes dialog
  const handleDiscardChanges = () => {
    setShowUnsavedChangesDialog(false);
    resetChanges();
  };

  // Save all changes
  const handleSaveChanges = () => {
    // Validate form before saving
    let isValid = true;
    const newErrors = {
      biografia: "",
      linkedin: "",
      github: "",
      researchGate: "",
      newTopic: "",
    };

    // Validate biography length
    if (personalInfo.biografia.length > 500) {
      newErrors.biografia = "La biografía no puede exceder los 500 caracteres";
      isValid = false;
    }

    // Validate URLs
    const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    if (personalInfo.linkedin && !urlRegex.test(personalInfo.linkedin)) {
      newErrors.linkedin = "URL de LinkedIn inválida";
      isValid = false;
    }
    
    if (personalInfo.github && !urlRegex.test(personalInfo.github)) {
      newErrors.github = "URL de GitHub inválida";
      isValid = false;
    }
    
    if (personalInfo.researchGate && !urlRegex.test(personalInfo.researchGate)) {
      newErrors.researchGate = "URL de ResearchGate inválida";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsEditing(false);
      setHasUnsavedChanges(false);
      // Success message would go here, but we're omitting toast functionality
    }
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);

    // Real-time validation for biografia
    if (name === "biografia" && value.length > 500) {
      setErrors(prev => ({
        ...prev,
        biografia: "La biografía no puede exceder los 500 caracteres"
      }));
    } else if (name === "biografia") {
      setErrors(prev => ({
        ...prev,
        biografia: ""
      }));
    }

    // Real-time validation for URLs
    const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    if (name === "linkedin") {
      setErrors(prev => ({
        ...prev,
        linkedin: value && !urlRegex.test(value) ? "URL de LinkedIn inválida" : ""
      }));
    }
    
    if (name === "github") {
      setErrors(prev => ({
        ...prev,
        github: value && !urlRegex.test(value) ? "URL de GitHub inválida" : ""
      }));
    }
    
    if (name === "researchGate") {
      setErrors(prev => ({
        ...prev,
        researchGate: value && !urlRegex.test(value) ? "URL de ResearchGate inválida" : ""
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setImageError("Formato de imagen no válido. Use JPG, PNG o GIF.");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("La imagen no debe exceder 2MB.");
        return;
      }
      
      setSelectedFile(file);
      setImageError("");
      setShowImageCropDialog(true);
      setHasUnsavedChanges(true);
    }
  };

  // Add new area
  const handleAddArea = () => {
    if (newArea && !selectedAreas.includes(newArea)) {
      setSelectedAreas(prev => [...prev, newArea]);
      setNewArea("");
      setHasUnsavedChanges(true);
    }
  };

  // Remove area
  const handleRemoveArea = (area) => {
    setSelectedAreas(prev => prev.filter(a => a !== area));
    setHasUnsavedChanges(true);
  };

  // Add new interest topic from dropdown
  const handleAddTopic = () => {
    if (newTopic && !interestTopics.includes(newTopic)) {
      setInterestTopics(prev => [...prev, newTopic]);
      setNewTopic("");
      setHasUnsavedChanges(true);
    }
  };

  // Add custom interest topic
  const handleAddCustomTopic = () => {
    if (newCustomTopic && !interestTopics.includes(newCustomTopic)) {
      if (newCustomTopic.length > 50) {
        setErrors(prev => ({
          ...prev,
          newTopic: "El tema no puede exceder los 50 caracteres"
        }));
        return;
      }
      
      setInterestTopics(prev => [...prev, newCustomTopic]);
      setNewCustomTopic("");
      setErrors(prev => ({...prev, newTopic: ""}));
      setHasUnsavedChanges(true);
    }
  };

  // Remove interest topic
  const handleRemoveTopic = (topic) => {
    setInterestTopics(prev => prev.filter(t => t !== topic));
    setHasUnsavedChanges(true);
  };

  // Handle crop confirmation
  const handleConfirmCrop = () => {
    setShowImageCropDialog(false);
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil de Asesor</h1>
        
        {!isEditing ? (
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={handleEditClick}
          >
            <PenSquare size={18} />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleCancelEdit}
            >
              <X size={18} />
              Cancelar
            </Button>
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={handleSaveChanges}
            >
              <Save size={18} />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-gray-500 mb-6">Visualiza y actualiza tu información personal y profesional.</p>
      
      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="academic">Áreas Académicas</TabsTrigger>
          <TabsTrigger value="interests">Temas de Interés</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Tu imagen de perfil visible para los tesistas.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="w-40 h-40">
                  <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : ""} />
                  <AvatarFallback className="text-4xl bg-gray-200">
                    {personalInfo.nombres.charAt(0)}{personalInfo.primerApellido.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <div>
                      <input
                        type="file"
                        id="profile-photo"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="profile-photo">
                        <Button variant="outline" className="w-full cursor-pointer" asChild>
                          <span>Cambiar Foto</span>
                        </Button>
                      </label>
                    </div>
                    
                    {imageError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{imageError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <p>• Formatos: JPG, PNG, GIF</p>
                      <p>• Tamaño máximo: 2MB</p>
                      <p>• Dimensión recomendada: 400x400px</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Información básica de tu perfil como asesor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input 
                      id="nombres" 
                      name="nombres" 
                      value={personalInfo.nombres}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primerApellido">Primer Apellido</Label>
                    <Input 
                      id="primerApellido" 
                      name="primerApellido" 
                      value={personalInfo.primerApellido}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                    <Input 
                      id="segundoApellido" 
                      name="segundoApellido" 
                      value={personalInfo.segundoApellido}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input 
                    id="correo" 
                    name="correo" 
                    type="email" 
                    value={personalInfo.correo}
                    onChange={handlePersonalInfoChange}
                    disabled={true} // Email is always disabled, typically managed by system
                  />
                  <p className="text-xs text-gray-500 mt-1">El correo electrónico no puede ser modificado.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="biografia">Biografía</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Describe tu experiencia profesional y académica</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className={`text-sm ${personalInfo.biografia.length > 500 ? "text-red-500" : "text-gray-500"}`}>
                      {personalInfo.biografia.length}/500
                    </p>
                  </div>
                  <Textarea 
                    id="biografia" 
                    name="biografia" 
                    value={personalInfo.biografia}
                    onChange={handlePersonalInfoChange}
                    rows={4}
                    disabled={!isEditing}
                    className={errors.biografia ? "border-red-500" : ""}
                  />
                  {errors.biografia && <p className="text-sm text-red-500">{errors.biografia}</p>}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Enlaces Profesionales</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <LinkIcon className="h-4 w-4 ml-2 text-gray-500" />
                    </div>
                    <Input 
                      id="linkedin" 
                      name="linkedin" 
                      value={personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/username"
                      className={errors.linkedin ? "border-red-500" : ""}
                    />
                    {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="github">GitHub</Label>
                      <LinkIcon className="h-4 w-4 ml-2 text-gray-500" />
                    </div>
                    <Input 
                      id="github" 
                      name="github" 
                      value={personalInfo.github}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                      placeholder="https://github.com/username"
                      className={errors.github ? "border-red-500" : ""}
                    />
                    {errors.github && <p className="text-sm text-red-500">{errors.github}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="researchGate">ResearchGate</Label>
                      <LinkIcon className="h-4 w-4 ml-2 text-gray-500" />
                    </div>
                    <Input 
                      id="researchGate" 
                      name="researchGate" 
                      value={personalInfo.researchGate}
                      onChange={handlePersonalInfoChange}
                      disabled={!isEditing}
                      placeholder="https://researchgate.net/profile/Username"
                      className={errors.researchGate ? "border-red-500" : ""}
                    />
                    {errors.researchGate && <p className="text-sm text-red-500">{errors.researchGate}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Academic Areas Tab */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Áreas Académicas</CardTitle>
              <CardDescription>Selecciona tus áreas de especialización académica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedAreas.length > 0 ? (
                  selectedAreas.map(area => (
                    <Badge key={area} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                      {area}
                      {isEditing && (
                        <button 
                          onClick={() => handleRemoveArea(area)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-1"
                          type="button"
                          aria-label={`Eliminar ${area}`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <div className="w-full text-center py-4">
                    <p className="text-gray-500 italic">No has seleccionado ningún área académica.</p>
                    {isEditing && (
                      <p className="text-sm text-blue-600 mt-2">Utiliza el selector a continuación para añadir áreas.</p>
                    )}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Select value={newArea} onValueChange={setNewArea}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar área académica" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicAreas
                        .filter(area => !selectedAreas.includes(area))
                        .map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAddArea} 
                    variant="secondary" 
                    className="shrink-0"
                    disabled={!newArea}
                  >
                    <Plus size={18} />
                    Añadir
                  </Button>
                </div>
              )}

              {!isEditing && selectedAreas.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Información</AlertTitle>
                  <AlertDescription>
                    Estas áreas académicas determinarán los tipos de tesis que te serán asignadas.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interest Topics Tab */}
        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle>Temas de Interés</CardTitle>
              <CardDescription>Configura los temas en los que estás interesado como asesor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {interestTopics.length > 0 ? (
                  interestTopics.map(topic => (
                    <Badge key={topic} variant="outline" className="flex items-center gap-1 py-1 px-3">
                      {topic}
                      {isEditing && (
                        <button 
                          onClick={() => handleRemoveTopic(topic)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-1"
                          type="button"
                          aria-label={`Eliminar ${topic}`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <div className="w-full text-center py-4">
                    <p className="text-gray-500 italic">No has seleccionado ningún tema de interés.</p>
                    {isEditing && (
                      <p className="text-sm text-blue-600 mt-2">Selecciona temas o crea uno personalizado a continuación.</p>
                    )}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <>
                  <div className="flex gap-2">
                    <Select value={newTopic} onValueChange={setNewTopic}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar tema de interés" />
                      </SelectTrigger>
                      <SelectContent>
                        {interestTopicsOptions
                          .filter(topic => !interestTopics.includes(topic))
                          .map(topic => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddTopic} 
                      variant="secondary" 
                      className="shrink-0"
                      disabled={!newTopic}
                    >
                      <Plus size={18} />
                      Añadir
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Añadir tema personalizado</h3>
                    <div className="flex gap-2">
                      <Input 
                        value={newCustomTopic}
                        onChange={(e) => setNewCustomTopic(e.target.value)}
                        placeholder="Nombre del tema personalizado"
                        className={errors.newTopic ? "border-red-500" : ""}
                      />
                      <Button 
                        onClick={handleAddCustomTopic} 
                        variant="outline" 
                        className="shrink-0"
                        disabled={!newCustomTopic}
                      >
                        <Plus size={18} />
                        Crear
                      </Button>
                    </div>
                    {errors.newTopic && <p className="text-sm text-red-500 mt-1">{errors.newTopic}</p>}
                  </div>
                </>
              )}

              {!isEditing && interestTopics.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Información</AlertTitle>
                  <AlertDescription>
                    Los temas de interés ayudan a los tesistas a encontrar asesores con experiencia en sus áreas de investigación.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Sube tu currículum vitae actualizado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="mb-4">
                  <Upload size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Curriculum Vitae</h3>
                <p className="text-sm text-gray-500 mb-4">Sube tu CV en formato PDF, DOC o DOCX.</p>
                {isEditing ? (
                  <div className="space-y-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload size={16} />
                      Subir CV
                    </Button>
                    <p className="text-xs text-gray-500">CV actual: No hay CV cargado</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No has subido ningún CV.</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p className="font-medium">Formatos aceptados:</p>
                <p>PDF, DOC, DOCX</p>
                <p className="mt-2 text-xs text-gray-500">Tamaño máximo: 5MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Asesorías</CardTitle>
              <CardDescription>Resumen de tu actividad como asesor académico.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Asesorías Activas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tesis activas</p>
                      <p className="text-3xl font-bold text-blue-600">{advisingStats.activeTheses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tesistas actuales</p>
                      <p className="text-3xl font-bold text-blue-600">{advisingStats.activeTheses}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Asesorías Completadas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tesis completadas</p>
                      <p className="text-3xl font-bold text-green-600">{advisingStats.completedTheses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total tesistas</p>
                      <p className="text-3xl font-bold text-green-600">{advisingStats.totalStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Historial de Asesorías</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">Próximamente: Gráficos y estadísticas detalladas de tu actividad como asesor.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Crop Dialog */}
      <Dialog open={showImageCropDialog} onOpenChange={setShowImageCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Imagen</DialogTitle>
            <DialogDescription>
              Ajusta tu foto de perfil antes de guardarla.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex justify-center">
            {selectedFile && (
              <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                {/* Placeholder for actual cropping UI component */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                  Interfaz de recorte (simulada)
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleConfirmCrop}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. ¿Estás seguro que deseas descartar estos cambios?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinueEditing}>Continuar Editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges} className="bg-red-600 hover:bg-red-700">
              Descartar Cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}