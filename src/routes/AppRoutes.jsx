import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductForm from "../pages/products/ProductForm";
import {UnitsList} from "../pages/units/UnitsList";
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

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProductList />} />
                <Route path="/produtos/cadastro" element={<ProductForm />} />
                <Route path="/produtos/editar/:id" element={<ProductForm />} />
                <Route path="/produtos/:id/ficha-tecnica" element={<ProductTechnicalSheet />} />
                <Route path="/configuracoes/categorias" element={<ProductCategorySettings />} />
                <Route path="/configuracoes/tipos" element={<ProductTypeSettings />} />
                <Route path="/configuracoes/ocasioes" element={<ProductOccasionSettings />} />

                <Route path="/unidades" element={<UnitsList />} />
                <Route path="/unidades/cadastro" element={<UnitsForm />} />
                <Route path="/unidades/editar/:id" element={<UnitsForm />} />

                <Route path="/configuracoes/mao-de-obra" element={<LaborSettings />} />

                <Route path="/ingredientes" element={<IngredientList />} />
                <Route path="/ingredientes/cadastro" element={<IngredientForm />} />
                <Route path="/ingredientes/editar/:id" element={<IngredientForm />} />

                <Route path="/embalagens" element={<PackagingList />} />
                <Route path="/embalagens/cadastro" element={<PackagingForm />} />
                <Route path="/embalagens/editar/:id" element={<PackagingForm />} />
            </Routes>
        </BrowserRouter>
    );
}