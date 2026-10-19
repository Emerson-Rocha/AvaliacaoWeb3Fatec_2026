"use client";

import "./CadastroVacinaForm.css";
import Layout from "@/components/Layout/Layout";
import Button from "@/components/UI/Button/Button";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState
} from "react";
import { describe } from "node:test";


const vacinaSchema = Yup.object({
  nomeVacina: Yup.string()
    .required("Informe o nome da vacina"),

  tipoVacina: Yup.string()
    .required("Informe o tipo da vacina"),

  especie: Yup.string()
    .required("Informe a espécie"),

  fabricante: Yup.string()
    .required("Informe o fabricante"),

  descricao: Yup.string(),

  numeroLote: Yup.string().
    required("Informe o número do lote"),

  dataFabricacao: Yup.date()
    .required("Informe a data de fabricação"),

  dataValidade: Yup.date()
    .required("Informe a data de validade"),

  quantidadeRecebida: Yup.number()
    .required("Informe a quantidade recebida")
    .positive("Quantidade deve ser positiva"),

  dataEntrada: Yup.date()
    .required("Informe a data de entrada"),

  responsavel: Yup.string()
    .required("Informe o responsável"),

  fornecedor: Yup.string()
    .required("Informe o fornecedor"),

  notaFiscal: Yup.string()
    .required("Informe a nota fiscal"),

  valorUnitario: Yup.number()
    .required("Informe o valor unitário"),

  valorTotal: Yup.number()
    .required("Informe o valor total"),

  temperatura: Yup
    .string(),

  localArmazenamento: Yup.string(),

  refrigeracao: Yup.boolean()
    .required("Informe se necessita de refrigeração"),

})

export default function CadastroVacinaPage() {



  const router = useRouter();

  const [dadosIniciais, setDadosIniciais] = useState({
    nomeVacina: "",
    tipoVacina: "",
    especie: "",
    fabricante: "",
    descricao: "",
    numeroLote: "",
    dataFabricacao: "",
    dataValidade: "",
    quantidadeRecebida: "",
    dataEntrada: "",
    responsavel: "",
    fornecedor: "",
    notaFiscal: "",
    valorUnitario: "",
    valorTotal: "",
    temperatura: "",
    localArmazenamento: "",
    refrigeracao: false,
  });

  const searchParams = useSearchParams();

  const vacinaId = searchParams.get("id");

  const modoEdicao = vacinaId !== null;


  //==========================================================


  useEffect(() => {

    if (!modoEdicao) {
      return;
    }

    async function carregarVacina() {

      try {

        const response =
          await fetch("/api/vacinas");

        const vacinas =
          await response.json();

        const vacina =
          vacinas.find(
            (v: any) =>
              v.id === Number(vacinaId)
          );

        if (!vacina) {
          return;
        }

        setDadosIniciais({
          nomeVacina: vacina.nome || "",
          tipoVacina: vacina.tipo || "",
          especie: vacina.especie || "",
          fabricante: vacina.fabricante || "",
          descricao: vacina.descricao || "",
          numeroLote: vacina.lote || "",
          dataFabricacao:
            vacina.dataFabricacao || "",
          dataValidade:
            vacina.validade || "",
          quantidadeRecebida:
            vacina.quantidade || "",
          dataEntrada:
            vacina.dataEntrada || "",
          responsavel:
            vacina.responsavel || "",
          fornecedor:
            vacina.fornecedor || "",
          notaFiscal:
            vacina.notaFiscal || "",
          valorUnitario:
            vacina.valorUnitario || "",
          valorTotal:
            vacina.valorTotal || "",
          temperatura:
            vacina.temperatura || "",
          localArmazenamento:
            vacina.localArmazenamento || "",
          refrigeracao:
            vacina.refrigeracao || false,
        });

      } catch (error) {

        console.error(error);

      }

    }

    carregarVacina();

  }, [modoEdicao, vacinaId]);



  return (

    <Layout>
      <section className="vacina-container">

        {/* HEADER */}

        <div className="vacina-header">

          <h1>
            {modoEdicao
              ? "Editar Vacina"
              : "Cadastro de Vacinas"}
          </h1>

          <p>
            Gerencie vacinas, lotes, estoque e
            controle de armazenamento.
          </p>

        </div>

        <Formik
          initialValues={
            dadosIniciais
          }
          enableReinitialize
          // validationSchema={vacinaSchema}
          onSubmit={
            async (values, { resetForm }) => {
              try {

             

                const body = {
                  nome: values.nomeVacina,
                  tipo: values.tipoVacina,
                  especie: values.especie,
                  fabricante: values.fabricante,
                  descricao: values.descricao,
                  lote: values.numeroLote,
                  dataFabricacao: values.dataFabricacao,
                  dataValidade: values.dataValidade,
                  quantidadeRecebida: values.quantidadeRecebida,
                  dataEntrada:values.dataEntrada,
                  responsavel:values.responsavel,
                  fornecedor:values.fornecedor,
                  notaFiscal:values.notaFiscal,
                  valorUnitario:values.valorUnitario,
                  valorTotal: values.valorTotal,
                  temperatura:values.temperatura,
                  localArmazenamento: values.localArmazenamento
                };

                //===========================================




                const caminho = modoEdicao ? url + "/UPDATE" : url + "/addvacina";


                const response = await fetch(caminho, {
                  method: modoEdicao ? "PUT" : "POST",
                  // TIREI ESTA PARA DEFIDO DO FORMDATA
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                  // body: formData
                });

                if (response.MS == "OK") {
                  alert("Cadastro com Sucesso!!");
                }

                if (!response.ok) {

                  throw new Error(
                    "Erro ao salvar vacina"
                  );

                }

                alert(
                  modoEdicao
                    ? "Vacina atualizada com sucesso!"
                    : "Vacina cadastrada com sucesso!"
                );

                if (modoEdicao) {
                  router.push(
                    "/lista-vacinas"
                  );

                } else {

                  resetForm();

                }

              } catch (error) {

                console.error(error);

                alert(
                  "Erro ao cadastrar vacina"
                );

              }

            }}
        >

          {() => (

            <Form className="vacina-form">

              {/* INFORMAÇÕES DA VACINA */}

              <div className="form-card">
                <h2>
                  Informações da Vacina
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome da Vacina</label>
                    <Field
                      name="nomeVacina"
                      type="text"
                    />

                    <ErrorMessage
                      name="nomeVacina"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo</label>
                    <Field
                      as="select"
                      name="tipoVacina">
                      <option value="">
                        Selecione
                      </option>

                      <option value="V8">
                        V8
                      </option>

                      <option value="V10">
                        V10
                      </option>

                      <option value="Antirrabica">
                        Antirrábica
                      </option>

                      <option value="V4">
                        V4
                      </option>
                    </Field>

                    <ErrorMessage
                      name="tipoVacina"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Espécie</label>
                    <Field
                      as="select"
                      name="especie">
                      <option value="">
                        Selecione
                      </option>

                      <option value="cao">
                        Cão
                      </option>

                      <option value="gato">
                        Gato
                      </option>

                      <option value="ambos">
                        Ambos
                      </option>
                    </Field>
                    <ErrorMessage
                      name="especie"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fabricante</label>

                    <Field
                      name="fabricante"
                      type="text" />
                    <ErrorMessage
                      name="fabricante"
                      component="span"
                      className="error-message" />
                  </div>

                </div>

                <div className="form-group full-width">

                  <label>
                    Descrição
                  </label>

                  <Field
                    as="textarea"
                    name="descricao"
                  />

                </div>

              </div>

              {/*=========================CONTROLE DE LOTE======================== */}

              <div className="form-card">
                <h2>Controle de Lote</h2>

                <div className="form-grid">
                  {/* CAMPO LOTE DE FABRICANTE */}
                  <div className="form-group">
                    <label> Número do Lote  </label>

                    <Field
                      name="numeroLote"
                      type="text"
                    />
                    <ErrorMessage
                      name="numeroLote"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* DATA FABRICANTE */}
                  <div className="form-group">
                    <label>Data de Fabricação</label>

                    <Field
                      name="dataFabricacao"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataFabricacao"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* DATA DE VALIDADE */}
                  <div className="form-group">
                    <label>Data de Validade</label>

                    <Field
                      name="dataValidade"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataValidade"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* QUANTIDADE RECEBIDA */}
                  <div className="form-group">
                    <label>Quantidade Recebida</label>

                    <Field
                      name="quantidadeRecebida"
                      type="number"
                    />
                    <ErrorMessage
                      name="quantidadeRecebida"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>

              </div>

              {/* ================================================================ */}

              {/*========================ENTRADA NO ESTOQUE======================= */}

              <div className="form-card">

                <h2>Entrada no Estoque</h2>
                {/* Data de Entrada */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Data de Entrada</label>

                    <Field
                      name="dataEntrada"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataEntrada"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* RESPOSÁVEL */}
                  <div className="form-group">
                    <label>Responsável</label>

                    <Field
                      name="responsavel"
                      type="text"
                    />
                    <ErrorMessage
                      name="responsavel"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* Fornecedor */}
                  <div className="form-group">
                    <label>Fornecedor</label>

                    <Field
                      name="fornecedor"
                      type="text"/>
                    <ErrorMessage
                      name="fornecedor"
                      component="span"
                      className="error-message"
                    />
                  </div>
                   {/* NOTA FISCAL */}
                  <div className="form-group">
                    <label>Nota Fiscal</label>

                    <Field
                      name="notaFiscal"
                      type="text"
                    />
                    <ErrorMessage
                      name="notaFiscal"
                      component="span"
                      className="error-message"
                    />
                  </div>
                   {/* VALOR UNITÁRIO */}
                  <div className="form-group">
                    <label>Valor Unitário</label>

                    <Field
                      name="valorUnitario"
                      type="number"
                    />
                    <ErrorMessage
                      name="valorUnitario"
                      component="span"
                      className="error-message"
                    />
                  </div>
                    {/* VALOR TOTAL */}
                  <div className="form-group">
                    <label>Valor Total</label>

                    <Field
                      name="valorTotal"
                      type="number"
                    />
                    <ErrorMessage
                      name="valorTotal"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>
              </div>
             
              {/* ================================================================= */}

              {/*========================ARMAZENAMENTO============================= */}

              <div className="form-card">
                <h2>Armazenamento</h2>
                
                <div className="form-grid">
                 {/* TEMPERATURA */}
                  <div className="form-group">
                    <label>Temperatura Ideal</label>

                    <Field
                      name="temperatura"
                      type="text"
                    />
                  </div>
                  
                  {/* AMARZENAMENTO LOCAL */}
                  <div className="form-group">
                   
                    <label>
                      Local de Armazenamento
                    </label>
                    <Field
                      as="select"
                      name="localArmazenamento"
                    >
                      <option value="">
                        Não necessita de refrigeração
                      </option>

                      <option value="geladeira1">
                        Geladeira 1
                      </option>

                      <option value="freezer">
                        Freezer
                      </option>

                      <option value="sala">
                        Sala Veterinária
                      </option>
                    </Field>

                    <ErrorMessage
                      name="localArmazenamento"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>

              </div>
              
               {/* ================================================================= */}

              

              <div className="submit-area">

                <Button type="submit">
                  {
                    modoEdicao
                      ? "Salvar Alterações"
                      : "Cadastrar Vacina"
                  }
                </Button>

              </div>

            </Form>

          )}

        </Formik>

      </section>
    </Layout >
  );
}