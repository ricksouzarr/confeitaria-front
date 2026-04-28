import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/auth/PrivateRoute";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import ProductForm from "../pages/products/ProductForm";
import { UnitsList } from "../pages/units/UnitsList";
import UnitsForm from "../pages/units/UnitsForm";
import ProductList from "../pages/products/ProductList";
import ProductTechnicalSheet from "../pages/products/ProductTechnicalSheet";
import LaborSettings from "../pages/settings/LaborSettings";
import IngredientForm from "../pages/ingredients/IngredientForm";
import IngredientList from "../pages/ingredients/IngredientList";
import PackagingForm from "../pages/packaging/PackagingForm";
import PackagingList from "../pages/packaging/PackagingList";
import ProductCategorySettings from "../pages/settings/ProductCategorySettings";
import ProductTypeSettings from "../pages/settings/ProductTypeSettings";
import ProductOccasionSettings from "../pages/settings/ProductOccasionSettings";

const Private = ({ children }) => (
    <PrivateRoute>{children}</PrivateRoute>
);

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Private><Home /></Private>} />

                <Route path="/produtos" element={<Private><ProductList /></Private>} />
                <Route path="/produtos/cadastro" element={<Private><ProductForm /></Private>} />
                <Route path="/produtos/editar/:id" element={<Private><ProductForm /></Private>} />
                <Route path="/produtos/:id/ficha-tecnica" element={<Private><ProductTechnicalSheet /></Private>} />

                <Route path="/unidades" element={<Private><UnitsList /></Private>} />
                <Route path="/unidades/cadastro" element={<Private><UnitsForm /></Private>} />
                <Route path="/unidades/editar/:id" element={<Private><UnitsForm /></Private>} />

                <Route path="/ingredientes" element={<Private><IngredientList /></Private>} />
                <Route path="/ingredientes/cadastro" element={<Private><IngredientForm /></Private>} />
                <Route path="/ingredientes/editar/:id" element={<Private><IngredientForm /></Private>} />

                <Route path="/embalagens" element={<Private><PackagingList /></Private>} />
                <Route path="/embalagens/cadastro" element={<Private><PackagingForm /></Private>} />
                <Route path="/embalagens/editar/:id" element={<Private><PackagingForm /></Private>} />

                <Route path="/configuracoes/mao-de-obra" element={<Private><LaborSettings /></Private>} />
                <Route path="/configuracoes/categorias" element={<Private><ProductCategorySettings /></Private>} />
                <Route path="/configuracoes/tipos" element={<Private><ProductTypeSettings /></Private>} />
                <Route path="/configuracoes/ocasioes" element={<Private><ProductOccasionSettings /></Private>} />
            </Routes>
        </BrowserRouter>
    );
}