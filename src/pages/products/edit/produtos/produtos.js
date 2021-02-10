import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Input,
  Button,
  FormLabel,
  FormControl,
  Divider,
  Textarea,
  Heading,
  Select,
  Tooltip,
  Text,
} from "@chakra-ui/react";

import { FaCalculator } from "react-icons/fa";

import config from "../../../../configs";

import dataTrib from "../../../../data/data";

export default function Produtos() {
  return (
    <>
      <Tabs variant="enclosed" colorScheme={config.tabs}>
        <TabList>
          <Tab>Informações</Tab>
          <Tab>Tributação</Tab>
          <Tab>Preço e Frete</Tab>
        </TabList>

        <TabPanels>
          {/** INFORMAÇÕES */}
          <TabPanel>
            <Grid templateColumns="1fr" gap="15px">
              <Box>
                <Grid templateColumns="1fr 200px 200px" gap="15px">
                  <FormControl isRequired mr={3}>
                    <FormLabel>Nome do Produto</FormLabel>
                    <Input
                      placeholder="Nome"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>

                  <FormControl mr={3}>
                    <FormLabel>Cod. de Barras</FormLabel>
                    <Input
                      placeholder="Código de Barras"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>

                  <FormControl mr={3} isRequired>
                    <FormLabel>Cod. SKU</FormLabel>
                    <Input
                      placeholder="Código SKU"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr" mt={3} gap="15px">
                  <FormControl mr={3} isRequired>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea
                      placeholder="Descrição"
                      resize="none"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
          </TabPanel>

          {/** TRIBUTAÇÕES */}
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md">
                <Heading size="sm" p={3}>
                  ICMS
                </Heading>
                <Divider />
                <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Alíquota</FormLabel>
                    <Input
                      placeholder="Alíquota"
                      type="number"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>CSOSN</FormLabel>
                    <Select focusBorderColor={config.inputs}>
                      <option value={"101"}>
                        101 - Tributada pelo Simples Nacional com permissão de
                        crédito
                      </option>
                      <option value={"102"}>
                        102 - Tributada pelo Simples Nacional sem permissão de
                        crédito
                      </option>
                      <option value={"103"}>
                        103 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta
                      </option>
                      <option value={"201"}>
                        201 - Tributada pelo Simples Nacional com permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"202"}>
                        202 - Tributada pelo Simples Nacional sem permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"203"}>
                        203 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"300"}>300 - Imune</option>
                      <option value={"400"}>
                        400 - Não tributada pelo Simples Nacional
                      </option>
                      <option value={"500"}>
                        500 - ICMS cobrado anteriormente por substituição
                        tributária (substituído) ou por antecipação
                      </option>
                      <option value={"900"}>900 - Outros</option>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>

              <Box borderWidth="1px" rounded="md">
                <Heading size="sm" p={3}>
                  PIS
                </Heading>
                <Divider />
                <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Alíquota</FormLabel>
                    <Input
                      placeholder="Alíquota"
                      type="number"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>CST</FormLabel>
                    <Select focusBorderColor={config.inputs}>
                      {dataTrib.map((dt) => (
                        <option value={dt.code}>{dt.desc}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Box>

              <Box borderWidth="1px" rounded="md">
                <Heading size="sm" p={3}>
                  COFINS
                </Heading>
                <Divider />
                <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Alíquota</FormLabel>
                    <Input
                      placeholder="Alíquota"
                      type="number"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>CST</FormLabel>
                    <Select focusBorderColor={config.inputs}>
                      {dataTrib.map((dt) => (
                        <option value={dt.code}>{dt.desc}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap="15px" mt={3}>
              <Box borderWidth="1px" rounded="md">
                <Heading size="sm" p={3}>
                  ICMS Outros
                </Heading>
                <Divider />
                <Grid templateColumns="repeat(3, 1fr)" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Origem</FormLabel>
                    <Select focusBorderColor={config.inputs}>
                      <option value={"0"}>0 - Nacional</option>
                      <option value={"1"}>
                        1 - Estrangeira (importação direta)
                      </option>
                      <option value={"2"}>
                        2 - Estrangeira (adquirida no mercado interno)
                      </option>
                      <option value={"3"}>
                        3 - Nacional com mais de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"4"}>
                        4 - Nacional produzida através de processos produtivos
                        básicos
                      </option>
                      <option value={"5"}>
                        5 - Nacional com menos de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"6"}>
                        6 - Estrangeira (importação direta) sem produto nacional
                        similar
                      </option>
                      <option value={"7"}>
                        7 - Estrangeira (adquirida no mercado interno) sem
                        produto nacional similar
                      </option>
                      <option value={"8"}>
                        8 - Nacional, mercadoria ou bem com Conteúdo de
                        Importação superior a 70%;
                      </option>
                    </Select>
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>% Subst. Trib.</FormLabel>

                    <Tooltip
                      label="Alíquota de Substituição Tributária"
                      hasArrow
                    >
                      <Input
                        placeholder="Alíquota"
                        type="number"
                        focusBorderColor={config.inputs}
                      />
                    </Tooltip>
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>% MVA</FormLabel>

                    <Tooltip
                      label="Alíquota ST Margem de Valor Adicionada"
                      hasArrow
                    >
                      <Input
                        placeholder="Alíquota MVA"
                        type="number"
                        focusBorderColor={config.inputs}
                      />
                    </Tooltip>
                  </FormControl>
                </Grid>
                <Grid templateColumns="repeat(3, 1fr)" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Mod. BC ST</FormLabel>
                    <Tooltip
                      label="Modalidade de Base de Cálculo da Substituição Tributária"
                      hasArrow
                      placement="top"
                    >
                      <Select focusBorderColor={config.inputs}>
                        <option value={"0"}>
                          Preço tabelado ou máximo sugerido
                        </option>
                        <option value={"1"}>Lista Negativa (valor)</option>
                        <option value={"2"}>Lista Positiva (valor)</option>
                        <option value={"3"}>Lista Neutra (valor)</option>
                        <option value={"4"}>Margem Valor Agregado (%)</option>
                        <option value={"5"}>Pauta (valor)</option>
                      </Select>
                    </Tooltip>
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>% FCP</FormLabel>

                    <Tooltip label="Alíquota FCP" hasArrow>
                      <Input
                        placeholder="Alíquota"
                        type="number"
                        focusBorderColor={config.inputs}
                      />
                    </Tooltip>
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>% FCP ST</FormLabel>

                    <Tooltip
                      label="Alíquota FCP de Substituição Tributária"
                      hasArrow
                    >
                      <Input
                        placeholder="Alíquota MVA"
                        type="number"
                        focusBorderColor={config.inputs}
                      />
                    </Tooltip>
                  </FormControl>
                </Grid>
              </Box>

              <Box borderWidth="1px" rounded="md">
                <Heading size="sm" p={3}>
                  IPI
                </Heading>
                <Divider />
                <Grid templateColumns="1fr 1fr 1fr" gap="10px" p={2}>
                  <FormControl mr={3}>
                    <FormLabel>Alíquota</FormLabel>
                    <Input
                      placeholder="Alíquota"
                      type="number"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>Código</FormLabel>
                    <Input
                      placeholder="Código IPI"
                      type="text"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl mr={3}>
                    <FormLabel>IPI CST</FormLabel>
                    <Select focusBorderColor={config.inputs}>
                      <option value={""}>Nenhum</option>
                      <option value={"00"}>
                        00 – Entrada com Recuperação de Crédito
                      </option>
                      <option value={"01"}>
                        01 – Entrada Tributada com Alíquota Zero
                      </option>
                      <option value={"02"}>02 – Entrada Isenta</option>
                      <option value={"03"}>03 – Entrada Não Tributada</option>
                      <option value={"04"}>04 – Entrada Imune</option>
                      <option value={"05"}>05 – Entrada com Suspensão</option>
                      <option value={"49"}>49 – Outras Entradas</option>
                      <option value={"50"}>50 – Saída Tributada</option>
                      <option value={"51"}>
                        51 – Saída Tributável com Alíquota Zero
                      </option>
                      <option value={"52"}>52 – Saída Isenta</option>
                      <option value={"53"}>53 – Saída Não Tributada</option>
                      <option value={"54"}>54 – Saída Imune</option>
                      <option value={"55"}>55 – Saída com Suspensão</option>
                      <option value={"99"}>99 – Outras Saídas</option>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
          </TabPanel>

          {/** VALORES */}
          <TabPanel>
            <Grid templateColumns="repeat(4, 1fr)" gap="15px">
              <FormControl isRequired mr={3}>
                <FormLabel>Margem de Lucro %</FormLabel>
                <Input
                  placeholder="Margem de Lucro"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired mr={3}>
                <FormLabel>Valor de Custo</FormLabel>
                <Input
                  placeholder="Valor de Custo"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl mr={3}>
                <FormLabel>Outros Custos</FormLabel>
                <Input
                  placeholder="Outros Custos"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired mr={3}>
                <FormLabel>Valor de Venda</FormLabel>
                <Input
                  placeholder="Valor de Venda"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>
            <Button leftIcon={<FaCalculator />} mt={3}>
              Calcular Preço de Venda
            </Button>
            <Divider mt={5} mb={5} />
            <Text fontSize="sm" color="red.400" mb={3}>
              Preencha cada campo com a quantidade referente a 1 (um) item.
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap="15px">
              <FormControl isRequired mr={3}>
                <FormLabel>Altura</FormLabel>
                <Input
                  placeholder="Altura"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired mr={3}>
                <FormLabel>Largura</FormLabel>
                <Input
                  placeholder="Largura"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired mr={3}>
                <FormLabel>Comprimento</FormLabel>
                <Input
                  placeholder="Comprimento"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired mr={3}>
                <FormLabel>Peso</FormLabel>
                <Input
                  placeholder="Peso"
                  type="number"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
