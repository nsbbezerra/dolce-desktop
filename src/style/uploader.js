import styled from "@emotion/styled";
import config from "../configs/index";
import { theme } from "@chakra-ui/react";

export const InputFile = styled.label`
  width: ${(props) => props.lar || 0}px;
  height: ${(props) => props.alt || 0}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 3px;
  color: ${(props) =>
    props.cor === "light" ? theme.colors.gray[800] : theme.colors.white};
  font-size: 15px;
  border: 1px dashed ${config.primary};
  text-align: center;
  transition: all 0.3s;

  &:hover {
    border: 2px dashed ${config.primary};
  }
`;

export const File = styled.input`
  display: none;
`;
